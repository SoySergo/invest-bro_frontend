"use client";

import * as React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, BriefcaseBusiness, Heart, MessageCircle, User, LogOut, Settings, TrendingUp } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function MainNav() {
    const t = useTranslations("Navigation");
    const tAuth = useTranslations("Auth");
    const tProfile = useTranslations("Profile");
    const { data: session } = useSession();
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
                            href="/investors"
                            className="transition-colors hover:text-foreground text-muted-foreground"
                        >
                            {t("investors")}
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
                        {session?.user ? (
                            <>
                                <Link href="/listing/create">
                                    <Button size="sm" className="bg-linear-to-r from-primary to-primary/80 btn-glow transition-all duration-200">
                                        {t("sellBusiness")}
                                    </Button>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={session.user.image ?? undefined} />
                                                <AvatarFallback>
                                                    {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="flex items-center gap-2 p-2">
                                            <div className="flex flex-col space-y-0.5">
                                                <p className="text-sm font-medium">{session.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{session.user.email}</p>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                {tProfile("title")}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile/settings" className="cursor-pointer">
                                                <Settings className="mr-2 h-4 w-4" />
                                                {tProfile("settings")}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                            onClick={() => signOut()}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            {tAuth("logoutButton")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
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
                                <Link href="/investors" className="text-lg font-medium flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    {t("investors")}
                                </Link>
                                <Link href="/favorites" className="text-lg font-medium flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    {t("favorites")}
                                </Link>
                                <Link href="/chat" className="text-lg font-medium flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    {t("chat")}
                                </Link>
                                {session?.user ? (
                                    <>
                                        <Link href="/profile" className="text-lg font-medium flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            {tProfile("title")}
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="justify-start text-lg font-medium text-destructive p-0 h-auto"
                                            onClick={() => signOut()}
                                        >
                                            <LogOut className="mr-2 h-5 w-5" />
                                            {tAuth("logoutButton")}
                                        </Button>
                                    </>
                                ) : (
                                    <Link href="/login" className="text-lg font-medium">
                                        {t("login")}
                                    </Link>
                                )}
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
