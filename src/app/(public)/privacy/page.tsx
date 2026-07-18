import { PolicyPageContent } from "./_components/policy-page-content";

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  return (
    <PolicyPageContent
      keyName="privacyPolicy"
      title="Privacy Policy"
      fallbackBody="<p>At MM Laptop Center, we value your privacy. This policy outlines how we collect, use, and protect your personal information.</p>"
    />
  );
}

