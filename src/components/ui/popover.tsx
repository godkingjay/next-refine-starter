import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverClose = PopoverPrimitive.Close;
const PopoverArrow = PopoverPrimitive.Arrow;
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[999] w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

interface CustomPopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onClose: () => void;
  className?: string;
  trigger?: React.ReactNode;
}

const CustomPopover: React.FC<CustomPopoverProps> = ({
  children,
  open = false,
  onClose,
  className,
  trigger,
}) => {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (
      popoverRef.current &&
      !popoverRef.current.contains(event.target) &&
      !event.target.closest(".custom-popover-container")
    ) {
      onClose();
    }
  };

  React.useEffect(() => {
    document?.addEventListener("click", handleClickOutside);

    return () => {
      document?.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  return (
    <div className="relative" ref={popoverRef}>
      {trigger && trigger}
      {open && (
        <div
          className={cn(
            "custom-popover-container absolute left-0 z-[999] w-56 divide-y divide-default-100 rounded-md border border-default-200 bg-popover shadow-lg focus:outline-none",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

CustomPopover.displayName = "CustomPopover";

export {
  CustomPopover,
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
};
