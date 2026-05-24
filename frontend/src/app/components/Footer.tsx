import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-black text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="brand-serif text-2xl tracking-[0.25em] text-white">COLORI</p>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Produse profesionale pentru manichiura si pedichiura, livrate rapid in toata Moldova.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Shop</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/search" className="hover:text-white transition">Toate produsele</Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white transition">Categorii</Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-white transition">Favorite</Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white transition">Cos</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Informatii</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link href="/account" className="hover:text-white transition">Contul meu</Link>
            </li>
            <li>
              <a href="tel:+37360000000" className="hover:text-white transition">+373 600 00 000</a>
            </li>
            <li>
              <a href="mailto:contact@colori.md" className="hover:text-white transition">contact@colori.md</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Suport</h3>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Program: Luni - Vineri, 09:00 - 18:00
            <br />
            Retur simplu in 14 zile.
          </p>
          <div className="mt-6 rounded border border-zinc-700 p-4 text-sm text-zinc-200">
            Plati securizate si comenzi procesate manual de echipa COLORI.
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 text-center text-xs uppercase tracking-[0.14em] text-zinc-500 lg:col-span-4">
          © {new Date().getFullYear()} COLORI. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
}
