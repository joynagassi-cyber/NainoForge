import { cn } from "../lib/utils";

export function Spinner({
  className,
  label,
  size = "md",
}: {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-[1.5px]",
    md: "h-5 w-5 border-2",
    lg: "h-6 w-6 border-2",
  };

  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <span
        className={cn(
          "spinner",
          sizeClasses[size],
          className
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </span>
  );
}
