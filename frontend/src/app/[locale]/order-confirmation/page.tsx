import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const t = await getTranslations();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl border border-zinc-200 bg-zinc-100/60 p-10">
        <div className="mb-6">
          <svg className="mx-auto h-20 w-20 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="brand-serif text-4xl tracking-[0.08em] text-[#1A1A1A]">{t("order.title")}</h1>

        {order && (
          <p className="mt-5 text-lg text-zinc-600">
            {t("order.orderNumber")} <span className="font-semibold text-[#d7b4bb]">{order}</span>
          </p>
        )}

        <p className="mx-auto mt-4 max-w-lg text-zinc-400">
          {t("order.info")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/search" className="bg-[#5e000e] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]">
            {t("order.continueShopping")}
          </Link>
          <Link href="/" className="border border-zinc-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-800 transition hover:border-zinc-400">
            {t("order.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
