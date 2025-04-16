"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
        {
          "border-destructive bg-destructive text-destructive-foreground": variant === "destructive",
          "border-green-600 bg-green-50 text-green-800": variant === "success",
        },
        className
      )}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

// Simple toast function for use in the application
const toast = ({ title, description, variant = "default" }) => {
  // This is a simplified version that just logs to console
  // In a real app, this would use a toast context/state
  console.log(`Toast: ${variant} - ${title} - ${description}`);
  
  // Create and append a toast element to the DOM
  const toastContainer = document.getElementById('toast-container') || 
    (() => {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
      document.body.appendChild(container);
      return container;
    })();
    
  const toastElement = document.createElement('div');
  toastElement.className = `rounded-md p-4 mb-2 ${
    variant === 'destructive' ? 'bg-red-100 border border-red-400 text-red-700' :
    variant === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
    'bg-blue-100 border border-blue-400 text-blue-700'
  }`;
  
  const titleElement = document.createElement('div');
  titleElement.className = 'font-medium';
  titleElement.textContent = title;
  
  const descElement = document.createElement('div');
  descElement.className = 'text-sm';
  descElement.textContent = description;
  
  toastElement.appendChild(titleElement);
  toastElement.appendChild(descElement);
  toastContainer.appendChild(toastElement);
  
  // Remove after 5 seconds
  setTimeout(() => {
    toastElement.remove();
    if (toastContainer.children.length === 0) {
      toastContainer.remove();
    }
  }, 5000);
};

export { 
  ToastProvider, 
  ToastViewport, 
  Toast, 
  ToastTitle, 
  ToastDescription,
  toast 
};
