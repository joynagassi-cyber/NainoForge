"use strict";
// ─── Student AI public API ─────────────────────────────────────
// Feature-flagged premium module — nothing leaks when disabled.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiCopyMoat = exports.SessionArcEngine = exports.AssessmentEngine = exports.LearnerEvidencePack = exports.TurnInterruptionEngine = exports.RelationalStateEngine = void 0;
__exportStar(require("./contracts.js"), exports);
var engine_js_1 = require("./engine.js");
Object.defineProperty(exports, "RelationalStateEngine", { enumerable: true, get: function () { return engine_js_1.RelationalStateEngine; } });
Object.defineProperty(exports, "TurnInterruptionEngine", { enumerable: true, get: function () { return engine_js_1.TurnInterruptionEngine; } });
Object.defineProperty(exports, "LearnerEvidencePack", { enumerable: true, get: function () { return engine_js_1.LearnerEvidencePack; } });
Object.defineProperty(exports, "AssessmentEngine", { enumerable: true, get: function () { return engine_js_1.AssessmentEngine; } });
Object.defineProperty(exports, "SessionArcEngine", { enumerable: true, get: function () { return engine_js_1.SessionArcEngine; } });
Object.defineProperty(exports, "AntiCopyMoat", { enumerable: true, get: function () { return engine_js_1.AntiCopyMoat; } });
//# sourceMappingURL=index.js.map