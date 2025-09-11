
"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BarChart2,
  Settings,
  ShieldCheck,
  History,
  Train,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { TrainIcon } from "../icons/train-icon";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "#", icon: Train, label: "Rolling Stock" },
  { href: "#", icon: ShieldCheck, label: "Safety Rules" },
  { href: "#", icon: History, label: "Audit Logs" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-16 flex-col border-r bg-card sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 py-4">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <TrainIcon className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">RailVision AI</span>
        </Link>
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === item.href ? "bg-accent text-accent-foreground" : ""
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
