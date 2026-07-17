import { cn } from "../lib/utils";
import { type ReactNode } from "react";

function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "card rounded-md p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mb-3", className)}>{children}</div>
  );
}

function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3 className={cn("text-h3 text-text-primary font-semibold", className)}>
      {children}
    </h3>
  );
}

function CardContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("text-body text-text-muted", className)}>
      {children}
    </div>
  );
}

function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center gap-2 pt-3 border-t border-border-subtle",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
