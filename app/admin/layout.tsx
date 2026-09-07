import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import AdminTabs from "@/components/admin/AdminTabs";
import { ToastProvider } from "@/components/admin/ToastContext";
import "../admin.css";

export const dynamic = "force-dynamic";

// Private area — keep it out of search results even if a URL leaks.
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/login");

  return (
    <ToastProvider>
      <div className="adm-shell">
        <AdminTabs />
        <main className="adm-main">{children}</main>
      </div>
    </ToastProvider>
  );
}

