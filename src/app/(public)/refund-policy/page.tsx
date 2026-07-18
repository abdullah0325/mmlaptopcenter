import { PolicyPageContent } from "../privacy/_components/policy-page-content";

export const dynamic = "force-dynamic";

export default function RefundPolicyPage() {
  return (
    <PolicyPageContent
      keyName="refundPolicy"
      title="Refund Policy"
      fallbackBody="<p>Thank you for shopping at MM Laptop Center. If you are not entirely satisfied with your purchase, we're here to help.</p>"
    />
  );
}

