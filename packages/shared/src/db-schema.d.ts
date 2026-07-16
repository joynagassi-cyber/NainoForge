export interface NfSourceRecord {
    id: string;
    type: 'web_article' | 'youtube' | 'pdf';
    content_hash: string;
    status: 'pending' | 'processing' | 'ready' | 'error';
    metadata: Record<string, unknown>;
    created_at: number;
}
export declare const DB_NAME = "nainoforge";
export declare const STORE_NAME = "nf_sources";
