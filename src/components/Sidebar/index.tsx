"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconList, IconMessage } from "@tabler/icons-react";
import { useTheme } from "@mui/material";
import type { ElementType } from "react";

interface SidebarItem {
  label: string;
    icon: ElementType;
  href: string;
}

const sideBarItem: SidebarItem[] = [
    { label: "Dashboard", icon: IconList, href: "/admin" },
    { label: "Comments", icon: IconMessage, href: "/admin/comments" },
];

const Sidebar = () => {
    const pathname = usePathname();
    const theme = useTheme();

    return (
        <aside style={{ backgroundColor: theme.colors.snow50 }} className="h-full border-r border-black/10 p-3">
            <nav className="space-y-1">
                {sideBarItem.map((item: SidebarItem, idx: number) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            style={{
                                backgroundColor: isActive ? theme.colors.sand200 : "transparent",
                                color: isActive ? theme.colors.ink950 : theme.colors.olive800,
                            }}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-black/5"
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;