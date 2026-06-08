import { LoginForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Iniciar sesión — Kiori" };

export default function LoginPage({ searchParams }: { searchParams: { redirect?: string } }) {
  return <LoginForm redirect={searchParams.redirect} />;
}
