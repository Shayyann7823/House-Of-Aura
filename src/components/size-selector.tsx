"use client";

import { cn } from "@/lib/utils";

type Props = {
  sizes: string[];
  value: string | null;
  onChange: (size: string) => void;
};

export function SizeSelector({ sizes, value, onChange }: Props) {
  if (sizes.length === 0) return null;

  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Select size</div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChange(size)}
            className={cn(
              "h-11 min-w-11 px-3 border text-xs uppercase tracking-wider transition-colors",
              value === size
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-primary"
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}