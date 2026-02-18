import { BriefcaseBusiness } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 left-4 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <BriefcaseBusiness className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">InvestBro</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
