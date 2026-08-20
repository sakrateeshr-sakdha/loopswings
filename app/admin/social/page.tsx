import SocialManager from "@/components/admin/SocialManager";
import { readAll, sortByOrder } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  const items = sortByOrder(await readAll("social"));
  return <SocialManager initial={items} />;
}
