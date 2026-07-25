import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — House of Aura",
  description: "Sign in or create your House of Aura account.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
