import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart — House of Aura",
  description: "Review your House of Aura bag.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
