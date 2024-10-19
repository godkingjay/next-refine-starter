import { cn } from "@/lib/utils";
import "cleave.js/dist/addons/cleave-phone.us";
import { CleaveOptions } from "cleave.js/options";
import Cleave from "cleave.js/react";
import * as React from "react";
interface CleaveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: CleaveOptions;
}

const CleaveInput = React.forwardRef<HTMLInputElement, CleaveInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="w-full flex-1">
        <div className="relative">
          <Cleave
            type={type}
            className={cn(
              "border-default-300 flex h-10 w-full rounded border bg-background px-3 py-2 text-sm transition duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-accent-foreground/50 read-only:bg-secondary focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:bg-secondary disabled:opacity-50",

              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);
CleaveInput.displayName = "CleaveInput";

export { CleaveInput };
