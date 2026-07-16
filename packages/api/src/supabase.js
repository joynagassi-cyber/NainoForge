"use strict";
// ponytail: minimal Supabase client factory — env-gated, fails closed if missing.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupabaseClient = createSupabaseClient;
const supabase_js_1 = require("@supabase/supabase-js");
function createSupabaseClient(cfg) {
    return (0, supabase_js_1.createClient)(cfg.url, cfg.anonKey);
}
//# sourceMappingURL=supabase.js.map