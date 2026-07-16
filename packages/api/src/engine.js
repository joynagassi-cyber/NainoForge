"use strict";
// ponytail: real Supabase transport for @nainoforge/api.
// Offline-safe: requires config, surfaces backend errors, never silently drops.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiClient = void 0;
const supabase_js_1 = require("./supabase.js");
class ApiClient {
    cfg;
    constructor(cfg) {
        this.cfg = cfg;
    }
    #client() {
        return (0, supabase_js_1.createSupabaseClient)(this.cfg);
    }
    async pushSource(payload) {
        const supabase = this.#client();
        const { data, error } = await supabase
            .from('nf_sources')
            .insert({
            title: payload.title,
            raw_text: payload.content_markdown,
            source_type: payload.source_type,
            url: payload.url ?? null,
            privacy_level: 'personal',
            is_syncable: true,
            status: 'captured',
            metadata: payload.metadata,
        })
            .select('id')
            .single();
        if (error)
            throw new Error(`pushSource failed: ${error.message}`);
        return data.id;
    }
    async pullSources() {
        const supabase = this.#client();
        const { data, error } = await supabase
            .from('nf_sources')
            .select('id, title, raw_text, source_type, url, created_at')
            .order('created_at', { ascending: false });
        if (error)
            throw new Error(`pullSources failed: ${error.message}`);
        return (data ?? []).map((row) => ({
            title: row.title,
            content_markdown: row.raw_text ?? '',
            source_type: row.source_type,
            url: row.url ?? undefined,
            metadata: {},
        }));
    }
    async sync(queue) {
        const synced = [];
        const conflicts = [];
        for (const item of queue) {
            try {
                const id = await this.pushSource(item);
                synced.push(id);
            }
            catch (e) {
                conflicts.push({
                    local_id: item.title,
                    remote_id: 'unknown',
                });
            }
        }
        return { synced, conflicts };
    }
}
exports.ApiClient = ApiClient;
//# sourceMappingURL=engine.js.map