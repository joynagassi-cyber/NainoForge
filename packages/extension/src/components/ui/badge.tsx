import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium transition-colors",
  {
    variants: {
      variant: {
        forge: "bg-primary text-surface-base",
        "privacy-public": "bg-surface-3 text-text-muted",
        "privacy-personal": "bg-accent-warm text-surface-base",
        count: "bg-surface-3 text-text-muted rounded-md px-2",
        "status-dot": "w-2 h-2 rounded-full",
      },
      status: {
        online: "bg-state-forged",
        offline: "bg-state-leech",
      },
    },
    defaultVariants: {
      variant: "forge",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  count?: number;
  label?: string;
  status?: "online" | "offline";
}

export function Badge({
  className,
  variant = "forge",
  status,
  count,
  label,
  ...props
}: BadgeProps) {
  if (variant === "status-dot") {
    return (
      <span
        className={cn(badgeVariants({ variant: "status-dot" }), className)}
        aria-label={status === "online" ? "En ligne" : "Hors ligne"}
        role="img"
        {...props}
      />
    );
  }

  if (variant === "count" && count !== undefined) {
    return (
      <span
        className={cn(badgeVariants({ variant: "count" }), className)}
        {...props}
      >
        {count}
      </span>
    );
  }

  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {label}
    </span>
  );
}
