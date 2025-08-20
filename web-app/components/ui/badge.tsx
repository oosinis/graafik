import * as React from "react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "success"
    | "warning"
  | "destructive"
  | "purple";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
          "transition-colors",
          {
            default: "bg-zinc-900 text-zinc-50 border-transparent dark:bg-zinc-50 dark:text-zinc-900",
            secondary:
              "bg-zinc-100 text-zinc-800 border-transparent dark:bg-zinc-800 dark:text-zinc-100",
            outline: "text-zinc-700 border-zinc-300 dark:text-zinc-200 dark:border-zinc-600",
            success:
              "bg-green-500/15 text-green-700 border-green-600/30 dark:text-green-300 dark:border-green-400/40",
            warning:
              "bg-amber-500/15 text-amber-700 border-amber-600/30 dark:text-amber-300 dark:border-amber-400/40",
            destructive:
              "bg-rose-500/15 text-rose-700 border-rose-600/40 dark:text-rose-300 dark:border-rose-400/40",
            purple:
              "bg-violet-500/15 text-violet-700 border-violet-600/40 dark:text-violet-300 dark:border-violet-400/40",
          }[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
