import BrandsManager from "@/components/admin/BrandsManager";
import { readAll, sortByOrder } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const items = sortByOrder(await readAll("brands"));
  return <BrandsManager initial={items} />;
}
