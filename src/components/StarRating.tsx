"use client";
import React from "react";

type Props = {
  value: number;                 // 0..5 (peut être décimal pour la moyenne)
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;                 // taille en px (défaut 20)
  className?: string;
};

export default function StarRating({ value, onChange, readOnly, size = 20, className }: Props) {
  const stars = [1, 2, 3, 4, 5];
  const rounded = Math.max(0, Math.min(5, value || 0));
  const filledUpTo = Math.floor(rounded + 1e-9);

  return (
    <div className={`inline-flex items-center gap-1 ${className ?? ""}`} role="img" aria-label={`note ${rounded} sur 5`}>
      {stars.map((i) => {
        const filled = i <= filledUpTo;
        const btnProps = readOnly ? {} : {
          onClick: () => onChange?.(i),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChange?.(i); }
          },
          role: "button",
          tabIndex: 0,
          "aria-label": `${i} étoile${i>1?"s":""}`,
        };
        return (
          <span
            key={i}
            {...btnProps}
            className={`${readOnly ? "" : "cursor-pointer"} select-none`}
            style={{ width: size, height: size, lineHeight: `${size}px`, fontSize: size }}
          >
            <svg viewBox="0 0 24 24" width={size} height={size} className={filled ? "text-yellow-400" : "text-white/30"} fill="currentColor" aria-hidden>
              <path d="M12 .587l3.668 7.43 8.2 1.193-5.934 5.787 1.401 8.164L12 18.896l-7.335 4.265 1.401-8.164L.132 9.21l8.2-1.193L12 .587z"/>
            </svg>
          </span>
        );
      })}
      {!readOnly && <span className="ml-1 text-sm text-gray-300">{value || 0}/5</span>}
    </div>
  );
}
