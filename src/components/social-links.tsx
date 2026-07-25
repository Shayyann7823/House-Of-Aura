// components/social-links.tsx
"use client";

import { Instagram, Facebook, Youtube } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type Social = {
  name: string;
  icon: React.ReactNode;
};

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="currentColor">
    <path d="M16.6 5.82c-1-.99-1.55-2.32-1.55-3.7h-3.1v13.5a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.11V9.9a5.7 5.7 0 0 0-.78-.05A5.72 5.72 0 1 0 15.1 15.6V9.1a8.1 8.1 0 0 0 4.9 1.65V7.65a4.9 4.9 0 0 1-3.4-1.83Z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 md:h-6 md:w-6" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.82.49 3.53 1.34 5.01L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.02a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.2-.31a8.08 8.08 0 0 1-1.24-4.27c0-4.48 3.65-8.13 8.14-8.13 2.17 0 4.21.85 5.75 2.39a8.08 8.08 0 0 1 2.38 5.75c0 4.49-3.65 8.1-8.11 8.1Zm4.45-6.07c-.24-.12-1.43-.71-1.65-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
  </svg>
);

const socials: Social[] = [
  { name: "Instagram", icon: <Instagram className="h-5 w-5 md:h-6 md:w-6" /> },
  { name: "Facebook", icon: <Facebook className="h-5 w-5 md:h-6 md:w-6" /> },
  { name: "TikTok", icon: <TikTokIcon /> },
  { name: "WhatsApp", icon: <WhatsAppIcon /> },
  { name: "YouTube", icon: <Youtube className="h-5 w-5 md:h-6 md:w-6" /> },
];

export function SocialLinks() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Follow us
      </div>
      <div className="flex items-center justify-center rounded-full border border-white/15 bg-white/5 backdrop-blur-sm p-1.5">
        <div className="flex items-center gap-1">
          {socials.map((s) => (
            <Tooltip key={s.name}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={s.name}
                  className="group flex h-11 w-11 md:h-13 md:w-13 items-center justify-center rounded-full transition-all hover:bg-gold hover:text-gold-foreground hover:scale-110"
                >
                  {s.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent>{s.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}