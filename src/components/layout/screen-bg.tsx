import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

import "./index.css";

const ScreenBg = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("screen-bg w-[100vw] h-[100vh]", className)}
      {...props}>
      {children}
    </div>
  )
);
ScreenBg.displayName = "ScreenBg";

export { ScreenBg };
