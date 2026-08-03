"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToastCustom = useToastCustom;
const ToastContext_1 = require("../contexts/ToastContext");
function useToastCustom() {
    const { addToast } = (0, ToastContext_1.useToast)();
    const showToast = (variant, title, description) => {
        addToast({ variant, title, description });
    };
    return {
        success: (title, description) => showToast('success', title, description),
        error: (title, description) => showToast('error', title, description),
        info: (title, description) => showToast('info', title, description),
        warning: (title, description) => showToast('warning', title, description),
    };
}
//# sourceMappingURL=use-toast.js.map