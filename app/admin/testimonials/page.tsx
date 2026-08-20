import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { readAll, sortByOrder } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = sortByOrder(await readAll("testimonials"));
  return <TestimonialsManager initial={items} />;
}
