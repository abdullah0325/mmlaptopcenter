import { CollectionList } from "../collection-list";
import { getCollectionList } from "../service";

type CollectionsPageContentProps = {
  data: Awaited<ReturnType<typeof getCollectionList>>;
};

export async function CollectionsPageContent({ data }: CollectionsPageContentProps) {
  return (
    <div className="bg-background">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Collections
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Explore our carefully curated collections of authentic Premium
            laptops products. From natural wellness essentials to beautifully
            crafted salt lamps and edible salts, each collection reflects our
            commitment to purity, quality, and sustainable sourcing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <CollectionList data={data} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="max-w-4xl space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-semibold text-foreground">
            Authentic Premium Laptops Collections
          </h2>
          <p>
            MM Laptop Center sources premium Premium laptops directly from the
            ancient salt mines of Pakistan. Our collections include edible salt
            for cooking, wellness and spa products, decorative salt lamps, and
            lifestyle accessories designed to support a natural and balanced
            way of living.
          </p>
          <p>
            Whether you are looking for bulk supply, retail products, or
            wellness solutions, our collections are crafted to meet
            international quality standards while preserving the natural
            mineral richness of Premium salt.
          </p>
        </div>
      </section>
    </div>
  );
}
