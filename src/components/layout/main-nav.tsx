"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BriefcaseBusiness, Heart, MessageCircle } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function MainNav() {
    const t = useTranslations("Navigation");
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full border-b transition-all duration-200",
                "bg-background/60 backdrop-blur-xl supports-backdrop-filter:bg-background/60",
                scrolled ? "h-14 border-border/50" : "h-16 border-transparent"
            )}
        >
            <div className="container flex h-full items-center justify-between px-4 md:px-8">
                <div className="flex items-center">
                    {/* Logo */}
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <BriefcaseBusiness className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block text-lg tracking-tight">InvestBro</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link
                            href="/listings"
                            className="transition-colors hover:text-foreground text-muted-foreground"
                        >
                            {t("listings")}
                        </Link>
                        <Link
                            href="/favorites"
                            className="transition-colors hover:text-foreground text-muted-foreground"
                        >
                            {t("favorites")}
                        </Link>
                        <Link
                            href="/chat"
                            className="transition-colors hover:text-foreground text-muted-foreground"
                        >
                            {t("chat")}
                        </Link>
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-2">
                    <div className="hidden md:flex items-center space-x-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                {t("login")}
                            </Button>
                        </Link>
                        <Link href="/listing/create">
                            <Button size="sm" className="bg-linear-to-r from-primary to-primary/80 btn-glow transition-all duration-200">
                                {t("sellBusiness")}
                            </Button>
                        </Link>
                    </div>
                    <ThemeToggle />
                    <LanguageSwitcher />

                    {/* Mobile Menu - hidden since we have bottom tab bar, but keeping sheet for extra items */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">{t("toggleMenu")}</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pr-0 bg-surface-2/95 backdrop-blur-xl">
                            <div className="flex flex-col gap-4 mt-8">
                                <Link href="/" className="flex items-center space-x-2 mb-4">
                                    <BriefcaseBusiness className="h-6 w-6 text-primary" />
                                    <span className="font-bold">InvestBro</span>
                                </Link>
                                <Link href="/listings" className="text-lg font-medium">
                                    {t("listings")}
                                </Link>
                                <Link href="/favorites" className="text-lg font-medium flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    {t("favorites")}
                                </Link>
                                <Link href="/chat" className="text-lg font-medium flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    {t("chat")}
                                </Link>
                                <Link href="/login" className="text-lg font-medium">
                                    {t("login")}
                                </Link>
                                <Link href="/listing/create">
                                    <Button className="w-full">{t("sellBusiness")}</Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
