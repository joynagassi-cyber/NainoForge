import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

export function useToastCustom() {
  const { addToast } = useToast();

  const showToast = (variant: 'success' | 'error' | 'info' | 'warning', title: string, description?: string) => {
    addToast({ variant, title, description });
  };

  return {
    success: (title: string, description?: string) => showToast('success', title, description),
    error: (title: string, description?: string) => showToast('error', title, description),
    info: (title: string, description?: string) => showToast('info', title, description),
    warning: (title: string, description?: string) => showToast('warning', title, description),
  };
}