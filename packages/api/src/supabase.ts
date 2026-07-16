// ponytail: minimal Supabase client factory — env-gated, fails closed if missing.

import { createClient } from '@supabase/supabase-js';
import type { ApiClientConfig } from './contracts.js';

export function createSupabaseClient(cfg: ApiClientConfig) {
  return createClient(cfg.url, cfg.anonKey);
}
