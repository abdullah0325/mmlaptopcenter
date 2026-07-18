
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@esmate/shadcn/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@esmate/shadcn/components/ui/command";
import { Search as SearchIcon } from "@esmate/shadcn/pkgs/lucide-react";
import { searchProducts } from "@/components/search/actions";
import Image from "next/image";
import { useDebounce } from "@esmate/react/ahooks";
import { search } from "@/lib/pixel";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, { wait: 300 });
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchProducts>>>([]);
  const [loading, setLoading] = useState(false);
  const lastTrackedQuery = useRef("");

  useEffect(() => {
    const validQuery = debouncedQuery.trim();
    if (validQuery.length < 3) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      setLoading(true);
      try {
        const products = await searchProducts(validQuery);
        setResults(products);
        if (lastTrackedQuery.current !== validQuery) {
          search(validQuery);
          lastTrackedQuery.current = validQuery;
        }
      } catch (e) {
        console.error(e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (handle: string) => {
    onOpenChange(false);
    router.push(`/products/${handle}`);
  };

  const handleSearch = (value: string) => setQuery(value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-[550px]">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search products..."
              value={query}
              onValueChange={handleSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            <CommandEmpty>{loading ? "Searching..." : "No results found."}</CommandEmpty>
            {results.length > 0 && (
              <CommandGroup heading="Products">
                {results.map((product) => (
                  <CommandItem key={product.handle} onSelect={() => handleSelect(product.handle)}>
                    <div className="flex items-center gap-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                        {product.featuredImage && (
                          <Image src={product.featuredImage.url} alt={product.featuredImage.altText || ""} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
