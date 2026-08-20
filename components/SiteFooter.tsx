import Link from "next/link";
import SocialLinks from "./SocialLinks";
import { getPublishedSocial } from "@/lib/db";

export default async function SiteFooter() {
  const social = await getPublishedSocial();

  return (
    <>
      <SocialLinks links={social} />
      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <Link className="brand" href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="brand-logo" src="/images/logo.png" alt="" />
              LoopWings
            </Link>
            <small>Meta Ads Lead Generation for Travel Agencies</small>
          </div>
          <div className="footer-links">
            <Link href="/testimonials">Testimonials</Link>
            <Link href="/admin">Admin</Link>
          </div>
          <small>&copy; LoopWings</small>
        </div>
      </footer>
    </>
  );
}
