use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

// ─── FSRS-4 card state ──────────────────────────────────────────

#[wasm_bindgen]
#[derive(Clone)]
pub struct FsrsCard {
    pub(crate) id: String,
    pub(crate) stability: f64,
    pub(crate) difficulty: f64,
    pub(crate) last_review_at: f64,
    pub(crate) next_review_at: f64,
    pub(crate) reps: u32,
    pub(crate) last_rating: Option<Rating>,
}

#[wasm_bindgen]
impl FsrsCard {
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> String { self.id.clone() }

    #[wasm_bindgen(getter = stability)]
    pub fn stability(&self) -> f64 { self.stability }

    #[wasm_bindgen(getter = difficulty)]
    pub fn difficulty(&self) -> f64 { self.difficulty }

    #[wasm_bindgen(getter = lastReviewAt)]
    pub fn last_review_at(&self) -> f64 { self.last_review_at }

    #[wasm_bindgen(getter = nextReviewAt)]
    pub fn next_review_at(&self) -> f64 { self.next_review_at }

    #[wasm_bindgen(getter = reps)]
    pub fn reps(&self) -> u32 { self.reps }

    // String, not Option<Rating>, because wasm-bindgen v0.2.92
    // does not derive RefFromWasmAbi for enums used as return types.
    #[wasm_bindgen(getter = lastRating)]
    pub fn last_rating(&self) -> Option<String> {
        self.last_rating.map(|r| r.as_str().to_owned())
    }
}

// ─── Rating (opaque to TS — used internally, not exported from getters) ──

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Rating {
    Again,
    Hard,
    Good,
    Easy,
}

impl Rating {
    pub fn parse(s: &str) -> Option<Rating> {
        match s {
            "again" => Some(Rating::Again),
            "hard"  => Some(Rating::Hard),
            "good"  => Some(Rating::Good),
            "easy"  => Some(Rating::Easy),
            _ => None,
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            Rating::Again => "again",
            Rating::Hard  => "hard",
            Rating::Good  => "good",
            Rating::Easy  => "easy",
        }
    }
}

// ─── Scheduler defaults (mutable global) ────────────────────────

#[derive(Clone, Copy, Serialize, Deserialize)]
struct Defaults {
    initial_stability: f64,
    initial_difficulty: f64,
    again_factor: f64,
    hard_factor: f64,
    good_factor: f64,
    easy_factor: f64,
    hard_diff_delta: f64,
    good_diff_delta: f64,
    easy_diff_delta: f64,
}

impl Defaults {
    fn default_values() -> Self {
        Defaults {
            initial_stability: 0.5,
            initial_difficulty: 0.3,
            again_factor: 0.2,
            hard_factor: 1.2,
            good_factor: 1.0,
            easy_factor: 1.3,
            hard_diff_delta: -0.14,
            good_diff_delta: -0.14,
            easy_diff_delta: -0.18,
        }
    }
}

use std::cell::RefCell;
use std::rc::Rc;

thread_local! {
    static DEFAULTS: Rc<RefCell<Defaults>> = Rc::new(RefCell::new(Defaults::default_values()));
}

fn with_defaults<F: FnOnce(&mut Defaults) -> R, R>(f: F) -> R {
    DEFAULTS.with(|d| {
        let mut borrowed = d.borrow_mut();
        f(&mut borrowed)
    })
}

#[wasm_bindgen]
pub fn defaults() -> JsValue {
    let d = with_defaults(|d| *d);
    let obj = js_sys::Object::new();
    js_sys::Reflect::set(&obj, &JsValue::from_str("initialStability"), &JsValue::from_f64(d.initial_stability)).ok();
    js_sys::Reflect::set(&obj, &JsValue::from_str("initialDifficulty"), &JsValue::from_f64(d.initial_difficulty)).ok();
    js_sys::Reflect::set(&obj, &JsValue::from_str("againFactor"), &JsValue::from_f64(d.again_factor)).ok();
    js_sys::Reflect::set(&obj, &JsValue::from_str("hardFactor"), &JsValue::from_f64(d.hard_factor)).ok();
    js_sys::Reflect::set(&obj, &JsValue::from_str("goodFactor"), &JsValue::from_f64(d.good_factor)).ok();
    js_sys::Reflect::set(&obj, &JsValue::from_str("easyFactor"), &JsValue::from_f64(d.easy_factor)).ok();
    js_sys::Reflect::set(&obj, &JsValue::from_str("hardDiffDelta"), &JsValue::from_f64(d.hard_diff_delta)).ok();
    js_sys::Reflect::set(&obj, &JsValue::from_str("goodDiffDelta"), &JsValue::from_f64(d.good_diff_delta)).ok();
    js_sys::Reflect::set(&obj, &JsValue::from_str("easyDiffDelta"), &JsValue::from_f64(d.easy_diff_delta)).ok();
    obj.into()
}

#[wasm_bindgen]
pub fn set_defaults(opts: JsValue) {
    use wasm_bindgen::JsCast;
    let mut target = Defaults::default_values();
    if let Ok(obj) = opts.dyn_into::<js_sys::Object>() {
        macro_rules! pick { ($($k:ident => $f:ident),*) => { $(if let Some(val) = js_sys::Reflect::get(&obj, &JsValue::from_str(stringify!($k))).ok().and_then(|x| x.as_f64()) { target.$f = val; })* } }
        pick! {
            initialStability => initial_stability,
            initialDifficulty => initial_difficulty,
            againFactor      => again_factor,
            hardFactor       => hard_factor,
            goodFactor       => good_factor,
            easyFactor       => easy_factor,
            hardDiffDelta    => hard_diff_delta,
            goodDiffDelta    => good_diff_delta,
            easyDiffDelta    => easy_diff_delta
        }
    }
    with_defaults(|current| { *current = target; });
}

// ─── ReviewLogEntry ─────────────────────────────────────────────

#[wasm_bindgen]
pub struct ReviewLogEntry {
    card_id: String,
    rating: Rating,
    reviewed_at: f64,
    stability_before: f64,
    stability_after: f64,
    interval_before: f64,
    interval_after: f64,
}

#[wasm_bindgen]
impl ReviewLogEntry {
    #[wasm_bindgen(getter = cardId)]
    pub fn card_id(&self) -> String { self.card_id.clone() }

    // String instead of Rating — same RefFromWasmAbi restriction.
    #[wasm_bindgen(getter)]
    pub fn rating(&self) -> String { self.rating.as_str().into() }

    #[wasm_bindgen(getter = reviewedAt)]
    pub fn reviewed_at(&self) -> f64 { self.reviewed_at }

    #[wasm_bindgen(getter = stabilityBefore)]
    pub fn stability_before(&self) -> f64 { self.stability_before }

    #[wasm_bindgen(getter = stabilityAfter)]
    pub fn stability_after(&self) -> f64 { self.stability_after }

    #[wasm_bindgen(getter = intervalBefore)]
    pub fn interval_before(&self) -> f64 { self.interval_before }

    #[wasm_bindgen(getter = intervalAfter)]
    pub fn interval_after(&self) -> f64 { self.interval_after }
}

// ─── FsrsScheduler ──────────────────────────────────────────────

#[wasm_bindgen]
pub struct FsrsScheduler {
    cards: Vec<FsrsCard>,
}

#[wasm_bindgen]
impl FsrsScheduler {
    #[wasm_bindgen(constructor)]
    pub fn new() -> FsrsScheduler {
        FsrsScheduler { cards: Vec::new() }
    }

    /// Create a new card and index it. Returns the card so TS can hold a reference.
    pub fn create_card(&mut self, id: &str, now: f64) -> FsrsCard {
        let d = with_defaults(|d| *d);
        let card = FsrsCard {
            id: id.to_string(),
            stability: d.initial_stability,
            difficulty: d.initial_difficulty,
            last_review_at: now,
            next_review_at: now,
            reps: 0,
            last_rating: None,
        };
        self.cards.push(FsrsCard {
            id: card.id.clone(),
            stability: card.stability,
            difficulty: card.difficulty,
            last_review_at: card.last_review_at,
            next_review_at: card.next_review_at,
            reps: card.reps,
            last_rating: card.last_rating.clone(),
        });
        card
    }

    /// Review a card. `rating` is parsed from a string ("again"|"hard"|"good"|"easy").
    pub fn review_card(&mut self, card: &FsrsCard, rating_str: &str, now: f64) -> ReviewLogEntry {
        let rating = Rating::parse(rating_str).unwrap_or(Rating::Good);
        let d = with_defaults(|d| *d);
        let day_ms = 86_400_000.0;

        let interval_before = if card.reps > 0 {
            ((now - card.last_review_at) / day_ms).max(1.0).round()
        } else {
            0.0
        };
        let stability_before = card.stability;

        let mut next_stability;
        let mut next_difficulty = card.difficulty.clamp(0.01, 1.0);

        match rating {
            Rating::Again => {
                next_stability = (card.stability * d.again_factor).max(0.1);
            }
            Rating::Hard => {
                next_stability = card.stability * d.hard_factor;
                next_difficulty = (card.difficulty + d.hard_diff_delta).clamp(0.01, 1.0);
            }
            Rating::Good => {
                next_stability = card.stability * d.good_factor;
                next_difficulty = (card.difficulty + d.good_diff_delta).clamp(0.01, 1.0);
            }
            Rating::Easy => {
                next_stability = card.stability * d.easy_factor;
                next_difficulty = (card.difficulty + d.easy_diff_delta).clamp(0.01, 1.0);
            }
        }

        let next_interval = if matches!(rating, Rating::Again) {
            1.0
        } else {
            next_stability.max(1.0).round()
        };

        // Mutate the card in the vec
        if let Some(c) = self.cards.iter_mut().find(|c| c.id == card.id) {
            c.stability = next_stability;
            c.difficulty = next_difficulty;
            c.last_review_at = now;
            c.next_review_at = now + next_interval * day_ms;
            c.reps += 1;
            c.last_rating = Some(rating);
        }

        ReviewLogEntry {
            card_id: card.id.clone(),
            rating,
            reviewed_at: now,
            stability_before,
            stability_after: next_stability,
            interval_before,
            interval_after: next_interval,
        }
    }

    /// Retrievability 0..1 for a card at a given timestamp.
    pub fn retrievability(card: &FsrsCard, now: f64) -> f64 {
        if card.reps == 0 {
            return 0.0;
        }
        let days_since = (now - card.last_review_at) / 86_400_000.0;
        (-std::f64::consts::LN_2 * days_since / card.stability).exp()
    }

    /// Due cards sorted by next_review_at ascending.
    pub fn get_due(&self, now: f64) -> Vec<FsrsCard> {
        let mut due: Vec<FsrsCard> = self
            .cards
            .iter()
            .filter(|c| c.next_review_at <= now)
            .cloned()
            .collect();
        due.sort_by(|a, b| a.next_review_at.total_cmp(&b.next_review_at));
        due
    }

    /// All cards in insertion order.
    pub fn all_cards(&self) -> Vec<FsrsCard> {
        self.cards.clone()
    }
}
