
"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@esmate/shadcn/components/ui/button";
import { Card, CardFooter, CardHeader } from "@esmate/shadcn/components/ui/card";
import { Loader2 } from "@esmate/shadcn/pkgs/lucide-react";
import { useState } from "react";
import { getCollectionList } from "./service";
import { useRequest } from "@esmate/react/ahooks";
import { titleize } from "@esmate/utils/string";

interface Props {
  data: Awaited<ReturnType<typeof getCollectionList>>;
}

export function CollectionList(props: Props) {
  const [pages, setPages] = useState([props.data]);
  const lastPage = pages[pages.length - 1];
  const lastCursor = lastPage.edges[lastPage.edges.length - 1]?.cursor; // Optional chain in case empty
  const hasNextPage = lastPage.pageInfo.hasNextPage;

  const request = useRequest(
    async () => {
      setPages([...pages, await getCollectionList(lastCursor)]);
    },
    {
      manual: true,
    },
  );

  return (
    <section className="container mx-auto p-10 mt-10 mb-10">
      <h1 className="sr-only">Collections</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pages
          .flatMap(({ edges }) => edges)
          .map(({ node }) => (
            <Link key={node.handle} href={`/collections/${node.handle}`} className="group flex">
              <Card className="border-gray-200 flex w-full flex-col overflow-hidden pt-0">
                <CardHeader className="m-0 p-0">
                  {node.image ? (
                    <Image
                      src={node.image.url as string}
                      alt={node.image.altText || node.title}
                      height={node.image.height as number}
                      width={node.image.width as number}
                      loading="eager"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 aspect-[4/3]"
                    />
                  ) : (
                     <div className="flex h-[300px] w-full items-center justify-center bg-gray-200 text-gray-400">
                        No Image
                     </div>
                  )}
                </CardHeader>
                <CardFooter className="mt-auto flex flex-col items-start justify-center gap-2 p-4">
                  <h3 className="text-md font-bold">{titleize(node.title)}</h3>
                  {/* Optional: Add description snippet if needed, but keeping it clean for now */}
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
      {hasNextPage && (
        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            variant={request.error ? "destructive" : "default"}
            onClick={request.run}
            disabled={request.loading}
            className="min-w-50"
          >
            {request.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {request.loading ? "Loading..." : request.error ? "Try Again" : "Load More Collections"}
          </Button>
        </div>
      )}
    </section>
  );
}

