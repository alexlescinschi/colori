import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-[#F8F4F3] text-zinc-600">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="brand-serif text-2xl tracking-[0.25em] text-[#1A1A1A]">COLORI</p>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1A1A]">{t("footer.shop")}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/search" className="hover:text-[#1A1A1A] transition">{t("footer.allProducts")}</Link></li>
            <li><Link href="/" className="hover:text-[#1A1A1A] transition">{t("footer.categories")}</Link></li>
            <li><Link href="/wishlist" className="hover:text-[#1A1A1A] transition">{t("footer.favorites")}</Link></li>
            <li><Link href="/cart" className="hover:text-[#1A1A1A] transition">{t("footer.cart")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1A1A]">{t("footer.info")}</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/account" className="hover:text-[#1A1A1A] transition">{t("footer.myAccount")}</Link></li>
            <li><a href="tel:+37360000000" className="hover:text-[#1A1A1A] transition">{t("footer.phone")}</a></li>
            <li><a href="mailto:contact@colori.md" className="hover:text-[#1A1A1A] transition">{t("footer.email")}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1A1A]">{t("footer.support")}</h3>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            {t("footer.hours")}
            <br />
            {t("footer.returns")}
          </p>
          <div className="mt-6 rounded border border-zinc-300 p-4 text-sm text-zinc-700">
            {t("footer.security")}
          </div>
        </div>

        <div className="border-t border-zinc-200 pt-8 text-center text-xs uppercase tracking-[0.14em] text-zinc-500 lg:col-span-4">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
