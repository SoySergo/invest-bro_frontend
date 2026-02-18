"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Search, Store, Globe, TrendingUp, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { globalSearch, type SearchResults } from "@/lib/actions/search";

export function CommandSearch() {
  const t = useTranslations("Search");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>({
    listings: [],
    investors: [],
    jobs: [],
  });
  const [loading, setLoading] = React.useState(false);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = React.useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 2) {
      setResults({ listings: [], investors: [], jobs: [] });
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await globalSearch(value);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    setQuery("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push(path as any);
  };

  const hasResults =
    results.listings.length > 0 ||
    results.investors.length > 0 ||
    results.jobs.length > 0;

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 md:w-60 md:justify-start md:px-3 md:py-2 text-sm text-muted-foreground rounded-full"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline-flex">{t("placeholder")}</span>
        <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={t("inputPlaceholder")}
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          {loading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {t("searching")}
            </div>
          )}

          {!loading && query.length >= 2 && !hasResults && (
            <CommandEmpty>{t("noResults")}</CommandEmpty>
          )}

          {results.listings.length > 0 && (
            <CommandGroup heading={t("businesses")}>
              {results.listings.map((listing) => (
                <CommandItem
                  key={listing.id}
                  onSelect={() => handleSelect(`/listing/${listing.id}`)}
                  className="cursor-pointer"
                >
                  {listing.locationType === "online" ? (
                    <Globe className="mr-2 h-4 w-4 text-primary" />
                  ) : (
                    <Store className="mr-2 h-4 w-4 text-primary" />
                  )}
                  <div className="flex flex-col">
                    <span>{listing.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {listing.categoryName}
                      {listing.country && ` · ${listing.country}`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {results.investors.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t("investors")}>
                {results.investors.map((investor) => (
                  <CommandItem
                    key={investor.id}
                    onSelect={() => handleSelect(`/investor/${investor.id}`)}
                    className="cursor-pointer"
                  >
                    <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span>{investor.userName || investor.company}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {investor.type}
                        {investor.country && ` · ${investor.country}`}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {results.jobs.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading={t("jobs")}>
                {results.jobs.map((job) => (
                  <CommandItem
                    key={job.id}
                    onSelect={() => handleSelect(`/job/${job.id}`)}
                    className="cursor-pointer"
                  >
                    <Briefcase className="mr-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <span>{job.title}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {job.company && `${job.company} · `}{job.level}
                        {job.country && ` · ${job.country}`}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
