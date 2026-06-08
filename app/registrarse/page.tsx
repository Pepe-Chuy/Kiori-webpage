import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Registrarse — Kiori" };

export default function RegisterPage({ searchParams }: { searchParams: { redirect?: string } }) {
  return <RegisterForm redirect={searchParams.redirect} />;
}
