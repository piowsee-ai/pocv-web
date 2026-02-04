"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface Toast {
    id: string;
    message: string;
    invalidKey?: string;
    isExiting?: boolean;
}

interface ValidationToastContextType {
    showValidationError: (message: string, invalidKey?: string) => void;
}

const ValidationToastContext = createContext<ValidationToastContextType | null>(null);

export function useValidationToast() {
    const context = useContext(ValidationToastContext);
    if (!context) {
        throw new Error("useValidationToast must be used within ValidationToastProvider");
    }
    return context;
}

interface ValidationToastProviderProps {
    children: ReactNode;
}

export function ValidationToastProvider({ children }: ValidationToastProviderProps) {
    const [toast, setToast] = useState<Toast | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const dismissWithAnimation = useCallback(() => {
        // Start exit animation
        setToast((prev) => prev ? { ...prev, isExiting: true } : null);

        // Remove toast after animation completes
        exitTimeoutRef.current = setTimeout(() => {
            setToast(null);
            exitTimeoutRef.current = null;
        }, 300);
    }, []);

    const showValidationError = useCallback((message: string, invalidKey?: string) => {
        // Clear existing timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (exitTimeoutRef.current) {
            clearTimeout(exitTimeoutRef.current);
        }

        // Replace existing toast with new one (max 1 toast)
        const id = `toast-${Date.now()}`;
        setToast({ id, message, invalidKey, isExiting: false });

        // Auto-dismiss after 3 seconds
        timeoutRef.current = setTimeout(() => {
            dismissWithAnimation();
            timeoutRef.current = null;
        }, 3000);
    }, [dismissWithAnimation]);

    const dismissToast = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        dismissWithAnimation();
    }, [dismissWithAnimation]);

    return (
        <ValidationToastContext.Provider value={{ showValidationError }}>
            {children}

            {/* Single Toast - Fixed at bottom right */}
            {toast && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-none">
                    <div
                        className={cn(
                            "pointer-events-auto flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg",
                            "max-w-[90vw] sm:max-w-md",
                            "bg-red-500 text-white",
                            toast.isExiting
                                ? "animate-out slide-out-to-right-5 fade-out duration-300"
                                : "animate-in slide-in-from-right-5 fade-in duration-300"
                        )}
                    >
                        <span className="text-sm sm:text-base font-medium flex-1">
                            {toast.invalidKey && (
                                <span className="font-bold">&quot;{toast.invalidKey}&quot; </span>
                            )}
                            {toast.message}
                        </span>
                        <button
                            onClick={dismissToast}
                            className="text-white/70 hover:text-white transition-colors p-0.5 -mr-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </ValidationToastContext.Provider>
    );
}


