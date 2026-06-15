import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[3/2] w-full items-center justify-center bg-zinc-100 text-center text-xs uppercase tracking-widest text-zinc-600">
      {label}
    </div>
  );
}

export default async function DespreNoiPage() {
  const t = await getTranslations();

  return (
    <div className="bg-[#F8F4F3] text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="brand-serif mb-16 text-center text-4xl tracking-[0.15em] md:text-5xl">
          {t("about.title")}
        </h1>

        <div className="space-y-20">
          <Section
            title={t("about.sections.who")}
            image={<Placeholder label={t("about.sections.who")} />}
            reverse={false}
          >
            <p className="leading-relaxed text-zinc-600">
              {t("about.whoText")}
            </p>
          </Section>

          <Section
            title={t("about.sections.beginnings")}
            image={<Placeholder label={t("about.sections.beginnings")} />}
            reverse={true}
          >
            <p className="leading-relaxed text-zinc-600">
              {t("about.beginningsText")}
            </p>
          </Section>

          <Section
            title={t("about.sections.idea")}
            image={<Placeholder label={t("about.sections.idea")} />}
            reverse={false}
          >
            <p className="leading-relaxed text-zinc-600">
              {t("about.ideaText")}
            </p>
          </Section>

          <Section
            title={t("about.sections.reality")}
            image={<Placeholder label={t("about.sections.reality")} />}
            reverse={true}
          >
            <p className="leading-relaxed text-zinc-600">
              {t("about.realityText")}
            </p>
          </Section>

          <Section
            title={t("about.sections.why")}
            image={<Placeholder label={t("about.sections.why")} />}
            reverse={false}
          >
            <p className="leading-relaxed text-zinc-600">
              {t("about.whyText")}
            </p>
          </Section>
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/search"
            className="inline-block bg-[#5e000e] px-10 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
          >
            {t("about.cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
  image,
  reverse,
}: {
  title: string;
  children: React.ReactNode;
  image: React.ReactNode;
  reverse: boolean;
}) {
  return (
    <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${reverse ? "direction-rtl" : ""}`}>
      <div className={`space-y-4 ${reverse ? "md:order-2" : ""}`}>
        <h2 className="brand-serif text-2xl tracking-[0.15em] text-[#1A1A1A] md:text-3xl">
          {title}
        </h2>
        {children}
      </div>
      <div className={reverse ? "md:order-1" : ""}>
        {image}
      </div>
    </div>
  );
}
