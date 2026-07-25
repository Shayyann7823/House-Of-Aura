import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart — Heemia",
  description: "Review your Heemia bag.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
