import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — Heemia",
  description: "Sign in or create your Heemia account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
