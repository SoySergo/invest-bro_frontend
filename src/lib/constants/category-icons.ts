import {
    ShoppingCart, Cloud, FileText, Store, GraduationCap, Landmark,
    Smartphone, Megaphone, Gamepad2, UtensilsCrossed, ShoppingBag,
    Scissors, Dumbbell, Heart, Building2, Factory, Warehouse,
    Truck, Wheat, Ticket, Plane, Briefcase, Rocket, Handshake,
    type LucideIcon
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
    // Level 0 sections
    "online-business": Cloud,
    "offline-business": Store,
    "franchises": Briefcase,
    "startups": Rocket,
    "shares-partnership": Handshake,

    // Online categories
    "ecommerce": ShoppingCart,
    "saas": Cloud,
    "content-media": FileText,
    "marketplaces": Store,
    "edtech": GraduationCap,
    "fintech": Landmark,
    "mobile-apps": Smartphone,
    "agencies": Megaphone,
    "igaming": Gamepad2,

    // Offline categories
    "horeca": UtensilsCrossed,
    "retail": ShoppingBag,
    "b2c-services": Scissors,
    "real-estate": Building2,
    "manufacturing": Factory,
    "wholesale": Warehouse,
    "logistics": Truck,
    "agriculture": Wheat,
    "entertainment": Ticket,
    "tourism": Plane,
    "b2b-services": Briefcase,

    // Legacy slugs (backward compat)
    "restaurant": UtensilsCrossed,
    "hotel": Building2,
    "beauty": Heart,
    "automotive": Truck,
    "gym": Dumbbell,
    "service": Scissors,
    "content": FileText,
    "app": Smartphone,
    "marketplace": Store,
    "agency": Megaphone,
} as const;
