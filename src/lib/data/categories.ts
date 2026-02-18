import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, isNull, asc } from "drizzle-orm";

/**
 * Get top-level sections (level 0): Online Business, Offline Business, etc.
 */
export async function getSections() {
    return db.query.categories.findMany({
        where: isNull(categories.parentId),
        orderBy: [asc(categories.order)],
    });
}

/**
 * Get level-1 categories for a given section (parent).
 */
export async function getCategoriesByParent(parentId: string) {
    return db.query.categories.findMany({
        where: eq(categories.parentId, parentId),
        orderBy: [asc(categories.order)],
    });
}

/**
 * Get level-1 categories grouped by their section slug.
 * Useful for filters and wizard dropdowns.
 */
export async function getGroupedCategories() {
    const sections = await getSections();
    const result: {
        section: typeof sections[number];
        children: typeof sections;
    }[] = [];

    for (const section of sections) {
        const children = await getCategoriesByParent(section.id);
        result.push({ section, children });
    }

    return result;
}

/**
 * Get all level-1 categories (flat list for simple dropdowns).
 */
export async function getLevel1Categories() {
    const sections = await getSections();
    const all = [];
    for (const section of sections) {
        const children = await getCategoriesByParent(section.id);
        all.push(...children);
    }
    return all;
}

/**
 * Get level-1 categories filtered by section type (online/offline mapping).
 */
export async function getCategoriesByType(type: "online" | "offline") {
    const sectionSlugMap: Record<string, string[]> = {
        online: ["online-business"],
        offline: ["offline-business", "franchises", "startups", "shares-partnership"],
    };

    const slugs = sectionSlugMap[type] || [];
    const sections = await getSections();
    const matchingSections = sections.filter((s) => slugs.includes(s.slug));

    const all = [];
    for (const section of matchingSections) {
        const children = await getCategoriesByParent(section.id);
        all.push(...children);
    }
    return all;
}
