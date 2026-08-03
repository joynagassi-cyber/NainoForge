"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = Toast;
const lucide_react_1 = require("lucide-react");
const framer_motion_1 = require("framer-motion");
const utils_1 = require("../../lib/utils");
function Toast({ toast, onDismiss }) {
    const variantColors = {
        success: 'bg-state-forge text-white',
        error: 'bg-state-danger text-white',
        info: 'bg-state-info text-white',
        warning: 'bg-state-warning text-white',
    };
    const variantIcons = {
        success: <span className="text-xl">✓</span>,
        error: <span className="text-xl">✕</span>,
        info: <span className="text-xl">ℹ</span>,
        warning: <span className="text-xl">!</span>,
    };
    return (<framer_motion_1.motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className={(0, utils_1.cn)('flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-sm', variantColors[toast.variant])}>
      <div className="flex-shrink-0">{variantIcons[toast.variant]}</div>
      <div className="flex-1">
        <p className="font-medium">{toast.title}</p>
        {toast.description && (<p className="text-sm opacity-90 mt-1">{toast.description}</p>)}
      </div>
      <button onClick={onDismiss} aria-label="Fermer la notification" className="opacity-80 hover:opacity-100 transition-opacity">
        <lucide_react_1.X className="h-4 w-4"/>
      </button>
    </framer_motion_1.motion.div>);
}
//# sourceMappingURL=Toast.js.map