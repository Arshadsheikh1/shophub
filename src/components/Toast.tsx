import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Toast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (event: any) => {
      const { id, message, type } = event.detail;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    const handleRemove = (event: any) => {
      const { id } = event.detail;
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    window.addEventListener('toast', handleToast);
    window.addEventListener('toastRemove', handleRemove);

    return () => {
      window.removeEventListener('toast', handleToast);
      window.removeEventListener('toastRemove', handleRemove);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg animate-fade-in ${
            toast.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : toast.type === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
          )}
          <p
            className={`flex-1 text-sm font-medium ${
              toast.type === 'success'
                ? 'text-green-800'
                : toast.type === 'error'
                ? 'text-red-800'
                : 'text-blue-800'
            }`}
          >
            {toast.message}
          </p>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
