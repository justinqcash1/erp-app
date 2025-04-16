"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

// A simple date picker component that uses the native date input
const DatePicker = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="relative">
      <Input
        type="date"
        className={cn(className)}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});
DatePicker.displayName = "DatePicker";

export { DatePicker };
