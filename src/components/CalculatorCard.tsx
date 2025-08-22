"use client";
import React, { ReactNode } from "react";

interface CalculatorCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function CalculatorCard({ title, description, children }: CalculatorCardProps) {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      <div>{children}</div>
    </div>
  );
}
