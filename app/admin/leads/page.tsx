import LeadsList from "@/components/admin/LeadsList";
import { readAll } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const items = [...(await readAll("leads"))].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <>
      <div className="adm-head">
        <div>
          <h1>Enquiries</h1>
          <p>Everything submitted through the enquiry forms on the site.</p>
        </div>
      </div>
      <LeadsList initial={items} />
    </>
  );
}
