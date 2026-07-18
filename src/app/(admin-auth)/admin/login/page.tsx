import LoginForm from "@/components/admin/login-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/admin/dashboard");

  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
