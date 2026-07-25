"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";
import type { Category } from "@/lib/products";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ChartGroup = "women" | "men" | "kids" | "none";

function groupFor(category: Category): ChartGroup {
  if (category === "women-eastern" || category === "women-western") return "women";
  if (category === "men-eastern" || category === "men-western") return "men";
  if (category === "kids") return "kids";
  return "none";
}

type SizeRow = { size: string; chest: string; waist: string; hip: string; height?: string };

const WOMEN_CHART: SizeRow[] = [
  { size: "XS", chest: "32", waist: "25", hip: "35" },
  { size: "S", chest: "34", waist: "27", hip: "37" },
  { size: "M", chest: "36", waist: "29", hip: "39" },
  { size: "L", chest: "38", waist: "31", hip: "41" },
  { size: "XL", chest: "40", waist: "33", hip: "43" },
  { size: "XXL", chest: "42", waist: "35", hip: "45" },
];

const MEN_CHART: SizeRow[] = [
  { size: "XS", chest: "34", waist: "28", hip: "36" },
  { size: "S", chest: "36", waist: "30", hip: "38" },
  { size: "M", chest: "38", waist: "32", hip: "40" },
  { size: "L", chest: "40", waist: "34", hip: "42" },
  { size: "XL", chest: "42", waist: "36", hip: "44" },
  { size: "XXL", chest: "44", waist: "38", hip: "46" },
];

const KIDS_CHART: SizeRow[] = [
  { size: "2-3Y", chest: "21", waist: "20", hip: "22", height: "38-40 in" },
  { size: "4-5Y", chest: "23", waist: "21", hip: "24", height: "41-44 in" },
  { size: "6-7Y", chest: "25", waist: "22", hip: "26", height: "45-49 in" },
  { size: "8-9Y", chest: "27", waist: "23", hip: "28", height: "50-53 in" },
  { size: "10-11Y", chest: "29", waist: "24", hip: "30", height: "54-57 in" },
  { size: "12-13Y", chest: "31", waist: "25", hip: "32", height: "58-61 in" },
];

export function SizeChartModal({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const group = groupFor(category);

  if (group === "none") return null;

  const chart = group === "women" ? WOMEN_CHART : group === "men" ? MEN_CHART : KIDS_CHART;
  const hasHeight = group === "kids";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          <Ruler className="h-3.5 w-3.5" />
          Size guide
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-display text-2xl">Size guide</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p className="text-xs text-muted-foreground mb-4">
            All measurements in inches. Body measurements — for a relaxed fit, size up.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2">Size</th>
                <th className="py-2">Chest</th>
                <th className="py-2">Waist</th>
                <th className="py-2">Hip</th>
                {hasHeight && <th className="py-2">Height</th>}
              </tr>
            </thead>
            <tbody>
              {chart.map((row) => (
                <tr key={row.size} className="border-b border-border/60">
                  <td className="py-2 font-medium">{row.size}</td>
                  <td className="py-2">{row.chest}</td>
                  <td className="py-2">{row.waist}</td>
                  <td className="py-2">{row.hip}</td>
                  {hasHeight && <td className="py-2">{row.height ?? "—"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}