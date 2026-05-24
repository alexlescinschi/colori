import Link from "next/link";

const contacts = [
  {
    label: "Telefon",
    href: "tel:+37369123456",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    subtitle: "+373 69 123 456",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/37369123456",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    subtitle: "Scrie-ne pe WhatsApp",
  },
  {
    label: "Email",
    href: "mailto:hello@colori.md",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="1.6" />
        <polyline points="22,6 12,13 2,6" strokeWidth="1.6" />
      </svg>
    ),
    subtitle: "hello@colori.md",
  },
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com/colori.md",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="5" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/colori.md",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@colori.md",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.45 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.31 0 .61.05.89.14V9.89a6.33 6.33 0 0 0-.89-.09A6.34 6.34 0 0 0 2 16.14a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V10.4a8.28 8.28 0 0 0 4.9 1.53V8.45a4.87 4.87 0 0 1-.01-.04v-1.72z" />
      </svg>
    ),
  },
];

const hours = [
  { day: "Luni — Vineri", time: "09:00 — 18:00" },
  { day: "Sâmbătă", time: "10:00 — 15:00" },
  { day: "Duminică", time: "Închis" },
];

export default function ContactePage() {
  return (
    <div className="bg-[#09090c] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="brand-serif mb-4 text-center text-4xl tracking-[0.15em] md:text-5xl">
          Contacte
        </h1>
        <p className="mb-16 text-center text-sm tracking-wide text-zinc-400">
          Suntem aici pentru tine. Alege metoda preferată.
        </p>

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-4 border border-zinc-800 bg-[#121216] p-8 text-center transition hover:border-[#5e000e]"
            >
              <div className="text-zinc-300 transition group-hover:text-[#5e000e]">
                {c.icon}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em]">
                  {c.label}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{c.subtitle}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-md text-center">
          <h2 className="brand-serif mb-6 text-xl tracking-[0.12em]">Urmărește-ne</h2>
          <div className="flex justify-center gap-4">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
                aria-label={s.label}
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-md">
          <h2 className="brand-serif mb-6 text-center text-xl tracking-[0.12em]">
            Program de lucru
          </h2>
          <div className="border border-zinc-800 bg-[#121216] p-6">
            <table className="w-full text-sm">
              <tbody>
                {hours.map((h) => (
                  <tr key={h.day} className="border-b border-zinc-800 last:border-0">
                    <td className="py-3 font-medium text-zinc-200">{h.day}</td>
                    <td className="py-3 text-right text-zinc-400">{h.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
