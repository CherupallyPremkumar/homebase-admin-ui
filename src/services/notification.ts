import { toast as sonnerToast } from 'sonner';

// Notification service with consistent settings
export const notification = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
      className: 'bg-card border-border',
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
      className: 'bg-card border-border',
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
      className: 'bg-card border-border',
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
      className: 'bg-card border-border',
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message, {
      className: 'bg-card border-border',
    });
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};
