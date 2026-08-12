"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  rating,
  size = 14,
  className,
  showValue = false,
  count,
}: {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)));
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star className="absolute inset-0 text-muted-foreground/30" style={{ width: size, height: size }} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star
                  className="text-gold fill-gold"
                  style={{ width: size, height: size }}
                />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-foreground/80">{rating.toFixed(1)}</span>
      )}
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
