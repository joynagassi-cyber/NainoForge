import { Page } from '@playwright/test';
export declare const loadExtension: (page: Page) => Promise<void>;
export declare const waitForNainoForge: (page: Page) => Promise<void>;
export declare const clickNainoForgeIcon: (page: Page) => Promise<void>;
export declare const waitForSelectorWithRetry: (page: Page, selector: string, maxRetries?: number) => Promise<boolean>;
export declare const createTestReport: (testName: string, result: "passed" | "failed", details?: any) => any;
