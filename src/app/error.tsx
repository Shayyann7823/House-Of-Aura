"use client";

import { useEffect } from "react";
import { reportLovableError } from "@/lib/lovable-error-reporting";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportLovableError(error, { boundary: "next_error_boundary" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <button
          onClick={() => reset()}
          className="mt-6 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
