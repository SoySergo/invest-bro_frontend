export interface Country {
    code: string;
    currency: string;
}

/**
 * European countries supported by the platform.
 * Country code = ISO 3166-1 alpha-2.
 * Currency   = ISO 4217.
 */
export const COUNTRIES: Country[] = [
    // Euro-zone
    { code: "AT", currency: "EUR" },
    { code: "BE", currency: "EUR" },
    { code: "CY", currency: "EUR" },
    { code: "DE", currency: "EUR" },
    { code: "EE", currency: "EUR" },
    { code: "ES", currency: "EUR" },
    { code: "FI", currency: "EUR" },
    { code: "FR", currency: "EUR" },
    { code: "GR", currency: "EUR" },
    { code: "HR", currency: "EUR" },
    { code: "IE", currency: "EUR" },
    { code: "IT", currency: "EUR" },
    { code: "LT", currency: "EUR" },
    { code: "LU", currency: "EUR" },
    { code: "LV", currency: "EUR" },
    { code: "MT", currency: "EUR" },
    { code: "NL", currency: "EUR" },
    { code: "PT", currency: "EUR" },
    { code: "SI", currency: "EUR" },
    { code: "SK", currency: "EUR" },

    // Non-Euro EU / EEA / Europe
    { code: "BG", currency: "BGN" },
    { code: "CH", currency: "CHF" },
    { code: "CZ", currency: "CZK" },
    { code: "DK", currency: "DKK" },
    { code: "GB", currency: "GBP" },
    { code: "HU", currency: "HUF" },
    { code: "IS", currency: "ISK" },
    { code: "LI", currency: "CHF" },
    { code: "MC", currency: "EUR" },
    { code: "ME", currency: "EUR" },
    { code: "NO", currency: "NOK" },
    { code: "PL", currency: "PLN" },
    { code: "RO", currency: "RON" },
    { code: "RS", currency: "RSD" },
    { code: "SE", currency: "SEK" },
] as const;

/** All country codes */
export const COUNTRY_CODES = COUNTRIES.map((c) => c.code);

/** Map code → currency */
export const COUNTRY_CURRENCY_MAP: Record<string, string> = Object.fromEntries(
    COUNTRIES.map((c) => [c.code, c.currency]),
);

/** Unique currencies used across platform countries */
export const CURRENCIES = [...new Set(COUNTRIES.map((c) => c.currency))].sort();

/**
 * Format a price according to locale + currency.
 * Uses Intl.NumberFormat — automatically picks the right symbol & separators.
 */
export function formatPrice(
    value: number,
    currency: string,
    locale: string = "en",
): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}
