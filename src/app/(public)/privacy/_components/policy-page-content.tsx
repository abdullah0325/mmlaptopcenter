import { getPolicyContent } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

interface PolicyPageContentProps {
  keyName: "privacyPolicy" | "termsOfService" | "refundPolicy";
  title: string;
  fallbackBody: string;
}

export async function PolicyPageContent({
  keyName,
  title,
  fallbackBody,
}: PolicyPageContentProps) {
  const policy = await getPolicyContent(keyName, {
    title,
    body: fallbackBody,
  });

  return (
    <div className="bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-muted-foreground">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{policy.title}</h1>
        <div
          className="prose prose-gray mt-6 max-w-none text-base leading-7 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: policy.body }}
        />
      </div>
    </div>
  );
}
