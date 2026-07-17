import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-surface-base hover:bg-primary-dark active:bg-primary-darkest",
        secondary:
          "bg-surface-2 text-text-primary hover:bg-surface-3 border border-border-default",
        ghost:
          "text-text-muted hover:text-text-primary hover:bg-surface-2",
        destructive:
          "bg-state-leech text-surface-base hover:bg-red-600",
        forge:
          "btn-forge",
      },
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-10 px-4 text-body",
        lg: "h-12 px-6 text-h3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  className,
  variant = "secondary",
  size = "md",
  loading,
  iconLeft,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      aria-busy={loading ? "true" : undefined}
      {...props}
    >
      {loading && (
        <span className="spinner h-4 w-4 border-[1.5px]" aria-hidden="true" />
      )}
      {!loading && iconLeft && <span className="shrink-0">{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
