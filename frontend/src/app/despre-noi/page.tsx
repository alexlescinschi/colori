import Link from "next/link";

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex aspect-[3/2] w-full items-center justify-center bg-zinc-100 text-center text-xs uppercase tracking-widest text-zinc-600">
      {label}
    </div>
  );
}

export default function DespreNoiPage() {
  return (
    <div className="bg-[#F8F4F3] text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="brand-serif mb-16 text-center text-4xl tracking-[0.15em] md:text-5xl">
          Despre Noi
        </h1>

        <div className="space-y-20">
          <Section
            title="Cine suntem"
            image={<Placeholder label="Echipa COLORI" />}
            reverse={false}
          >
            <p className="leading-relaxed text-zinc-600">
              Suntem <strong className="text-[#1A1A1A]">Alex</strong> și <strong className="text-[#1A1A1A]">Elena</strong>, un cuplu din
              Republica Moldova care a transformat pasiunea pentru unghii într-un business
              înfloritor. Totul a început când Elena, pe atunci studentă, a urmat un curs de
              manichiură și a descoperit că aceasta este chemarea ei.
            </p>
          </Section>

          <Section
            title="Începuturile"
            image={<Placeholder label="Primele noastre produse" />}
            reverse={true}
          >
            <p className="leading-relaxed text-zinc-600">
              În 2020, Elena și-a deschis propria activitate, iar în scurt timp a creat un cont
              de Instagram pentru a-și împărtăși lucrările. Cererile pentru recomandări de
              produse au început să curgă, iar împreună cu Alex au decis să transforme această
              nevoie într-un magazin online.
            </p>
          </Section>

          <Section
            title="Ideea"
            image={<Placeholder label="Planificare si viziune" />}
            reverse={false}
          >
            <p className="leading-relaxed text-zinc-600">
              Într-o seară, la cină, Alex a venit cu ideea: să creăm un magazin online unde
              manichiuriștii să găsească produse profesionale testate și verificate de noi.
              Am pornit la drum, am găsit furnizori de încredere și am construit COLORI —
              un nume care reflectă esența meseriei noastre.
            </p>
          </Section>

          <Section
            title="Realitatea noastră"
            image={<Placeholder label="Echipa COLORI azi" />}
            reverse={true}
          >
            <p className="leading-relaxed text-zinc-600">
              Astăzi, COLORI înseamnă mult mai mult decât un magazin. Am creat o comunitate
              de profesioniști care împărtășesc aceeași pasiune. Fiecare produs din catalog
              este ales cu grijă, testat și aprobat de echipa noastră.
            </p>
          </Section>

          <Section
            title="De ce COLORI"
            image={<Placeholder label="Produsele noastre" />}
            reverse={false}
          >
            <p className="leading-relaxed text-zinc-600">
              Pentru că <strong className="text-[#1A1A1A]">fiecare detaliu contează</strong>. De la
              formula fiecărui gel până la ambalaj și livrare — totul este gândit pentru a oferi
              cea mai bună experiență. Sprijinul vostru ne motivează să facem mereu mai bine.
            </p>
          </Section>
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/search"
            className="inline-block bg-[#5e000e] px-10 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023]"
          >
            Descoperă produsele noastre
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
