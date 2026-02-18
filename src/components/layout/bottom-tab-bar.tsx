"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { House, Search, PlusCircle, Heart, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
    const t = useTranslations("Navigation");
    const pathname = usePathname();
    const { data: session } = useSession();

    const tabs = [
        { href: "/", icon: House, labelKey: "home" },
        { href: "/listings", icon: Search, labelKey: "listings" },
        { href: "/listing/create", icon: PlusCircle, labelKey: "create" },
        { href: "/favorites", icon: Heart, labelKey: "favorites" },
        session?.user
            ? { href: "/profile", icon: User, labelKey: "profile" }
            : { href: "/login", icon: LogIn, labelKey: "login" },
    ] as const;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            <div
                className="flex items-center justify-around border-t bg-background/80 backdrop-blur-xl"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                {tabs.map((tab) => {
                    const isActive =
                        tab.href === "/"
                            ? pathname === "/" || pathname === ""
                            : pathname.startsWith(tab.href);

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center gap-1 py-2 px-3 min-w-16 transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <tab.icon
                                className={cn(
                                    "h-5 w-5 transition-transform active:scale-95",
                                    isActive && "drop-shadow-[0_0_4px_var(--primary)]"
                                )}
                            />
                            <span
                                className={cn(
                                    "text-[10px] leading-none",
                                    isActive ? "font-semibold" : "font-medium"
                                )}
                            >
                                {t(tab.labelKey)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
