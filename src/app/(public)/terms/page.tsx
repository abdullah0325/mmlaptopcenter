import { PolicyPageContent } from "../privacy/_components/policy-page-content";

export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <PolicyPageContent
      keyName="termsOfService"
      title="Terms and Conditions"
      fallbackBody="<p>Welcome to MM Laptop Center. These terms and conditions outline the rules and regulations for the use of our Website.</p>"
    />
  );
}

