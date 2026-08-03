"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastProvider = ToastProvider;
exports.useToast = useToast;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const Toast_1 = require("./ui/Toast");
const ToastContext = (0, react_1.createContext)(undefined);
function ToastProvider({ children }) {
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const addToast = (toastData) => {
        const id = Date.now().toString();
        const newToast = { ...toastData, id };
        setToasts(prev => [...prev, newToast]);
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };
    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };
    return (<ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toasts container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-4">
        {toasts.map(toast => (<framer_motion_1.motion.div key={toast.id} initial={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} exit={{ opacity: 0, translateX: 20 }} transition={{ duration: 0.2 }}>
            <Toast_1.Toast toast={toast} onDismiss={() => removeToast(toast.id)}/>
          </framer_motion_1.motion.div>))}
      </div>
    </ToastContext.Provider>);
}
function useToast() {
    const context = (0, react_1.useContext)(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
//# sourceMappingURL=ToastContext.js.map