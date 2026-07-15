let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}
/**
* @returns {any}
*/
export function defaults() {
    const ret = wasm.defaults();
    return takeObject(ret);
}

/**
* @param {any} opts
*/
export function set_defaults(opts) {
    wasm.set_defaults(addHeapObject(opts));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

const FsrsCardFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fsrscard_free(ptr >>> 0));
/**
*/
export class FsrsCard {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FsrsCard.prototype);
        obj.__wbg_ptr = ptr;
        FsrsCardFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FsrsCardFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fsrscard_free(ptr);
    }
    /**
    * @returns {string}
    */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fsrscard_id(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {number}
    */
    get stability() {
        const ret = wasm.fsrscard_stability(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get difficulty() {
        const ret = wasm.fsrscard_difficulty(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get lastReviewAt() {
        const ret = wasm.fsrscard_last_review_at(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get nextReviewAt() {
        const ret = wasm.fsrscard_next_review_at(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get reps() {
        const ret = wasm.fsrscard_reps(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @returns {string | undefined}
    */
    get lastRating() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fsrscard_last_rating(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const FsrsSchedulerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fsrsscheduler_free(ptr >>> 0));
/**
*/
export class FsrsScheduler {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FsrsSchedulerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fsrsscheduler_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.fsrsscheduler_new();
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * Create a new card and index it. Returns the card so TS can hold a reference.
    * @param {string} id
    * @param {number} now
    * @returns {FsrsCard}
    */
    create_card(id, now) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.fsrsscheduler_create_card(this.__wbg_ptr, ptr0, len0, now);
        return FsrsCard.__wrap(ret);
    }
    /**
    * Review a card. `rating` is parsed from a string ("again"|"hard"|"good"|"easy").
    * @param {FsrsCard} card
    * @param {string} rating_str
    * @param {number} now
    * @returns {ReviewLogEntry}
    */
    review_card(card, rating_str, now) {
        _assertClass(card, FsrsCard);
        const ptr0 = passStringToWasm0(rating_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.fsrsscheduler_review_card(this.__wbg_ptr, card.__wbg_ptr, ptr0, len0, now);
        return ReviewLogEntry.__wrap(ret);
    }
    /**
    * Retrievability 0..1 for a card at a given timestamp.
    * @param {FsrsCard} card
    * @param {number} now
    * @returns {number}
    */
    static retrievability(card, now) {
        _assertClass(card, FsrsCard);
        const ret = wasm.fsrsscheduler_retrievability(card.__wbg_ptr, now);
        return ret;
    }
    /**
    * Due cards sorted by next_review_at ascending.
    * @param {number} now
    * @returns {(FsrsCard)[]}
    */
    get_due(now) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fsrsscheduler_get_due(retptr, this.__wbg_ptr, now);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * All cards in insertion order.
    * @returns {(FsrsCard)[]}
    */
    all_cards() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fsrsscheduler_all_cards(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const ReviewLogEntryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_reviewlogentry_free(ptr >>> 0));
/**
*/
export class ReviewLogEntry {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReviewLogEntry.prototype);
        obj.__wbg_ptr = ptr;
        ReviewLogEntryFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReviewLogEntryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reviewlogentry_free(ptr);
    }
    /**
    * @returns {string}
    */
    get cardId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.reviewlogentry_card_id(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {string}
    */
    get rating() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.reviewlogentry_rating(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {number}
    */
    get reviewedAt() {
        const ret = wasm.fsrscard_stability(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get stabilityBefore() {
        const ret = wasm.fsrscard_difficulty(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get stabilityAfter() {
        const ret = wasm.fsrscard_last_review_at(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get intervalBefore() {
        const ret = wasm.fsrscard_next_review_at(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get intervalAfter() {
        const ret = wasm.reviewlogentry_interval_after(this.__wbg_ptr);
        return ret;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbg_fsrscard_new = function(arg0) {
        const ret = FsrsCard.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_e3c254076557e348 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_72fb9a18b5ae2624 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_Object_71ca3c0a59266746 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_set_1f9b04f170055d33 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('fsrs_bindings_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
