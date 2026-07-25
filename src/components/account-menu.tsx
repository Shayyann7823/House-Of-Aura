"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "sonner";

export function AccountMenu() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    toast.success("Aap logout ho chuke hain");
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="p-2">
        <User className="h-5 w-5 opacity-40" />
      </div>
    );
  }

  if (!user) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/auth" className="p-2 hover:text-gold transition-colors" aria-label="Sign in">
            <User className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Sign in</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-2 py-2 hover:text-gold transition-colors" aria-label="Account menu">
              <User className="h-5 w-5" />
              <span className="hidden md:inline text-xs uppercase tracking-wide">
  Welcome, {user.name.split(" ")[0]}
</span>
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Account</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuLabel>Welcome, {user.name.split(" ")[0]}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account/orders" className="flex items-center gap-2 cursor-pointer">
            <Package className="h-4 w-4" />
            My Orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}