"use client";

import { FormEvent, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { clearAuth, fetchMe, getStoredUser, login, register } from "@/lib/auth";
import { getProductPath } from "@/lib/routes";
import { getWishlistItems, WishlistItem } from "@/lib/wishlist";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState(() => getStoredUser());
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    const init = async () => {
      const me = await fetchMe();
      setUser(me || getStoredUser());

      if (me) {
        const items = await getWishlistItems();
        setWishlist(items);
      }
    };

    void init();
  }, []);

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(loginIdentifier, loginPassword);
      const me = await fetchMe();
      setUser(me);
      setWishlist(await getWishlistItems());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Autentificare esuata");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(regName, regEmail, regPassword);
      const me = await fetchMe();
      setUser(me);
      setWishlist(await getWishlistItems());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Inregistrare esuata");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = () => {
    clearAuth();
    setUser(null);
    setWishlist([]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="brand-serif text-4xl tracking-[0.12em] text-[#1A1A1A]">{t("account.title")}</h1>

      {!user ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="panel-surface p-6">
            <div className="mb-5 flex gap-2 text-xs uppercase tracking-[0.14em]">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`px-4 py-2 ${mode === "login" ? "bg-[#5e000e] text-white" : "border border-zinc-300 text-zinc-600"}`}
              >
                {t("account.login")}
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`px-4 py-2 ${mode === "register" ? "bg-[#5e000e] text-white" : "border border-zinc-300 text-zinc-600"}`}
              >
                {t("account.register")}
              </button>
            </div>

            {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

            {mode === "login" ? (
              <form onSubmit={onLogin} className="space-y-4">
                <input
                  value={loginIdentifier}
                  onChange={(event) => setLoginIdentifier(event.target.value)}
                  placeholder={t("account.emailPlaceholder")}
                  className="w-full border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
                  required
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder={t("account.passwordPlaceholder")}
                  className="w-full border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5e000e] px-4 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-[#7e1023] disabled:opacity-60"
                >
                  {loading ? t("account.processing") : t("account.loginBtn")}
                </button>
              </form>
            ) : (
              <form onSubmit={onRegister} className="space-y-4">
                <input
                  value={regName}
                  onChange={(event) => setRegName(event.target.value)}
                  placeholder={t("account.usernamePlaceholder")}
                  className="w-full border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
                  required
                />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(event) => setRegEmail(event.target.value)}
                  placeholder={t("account.registerEmailPlaceholder")}
                  className="w-full border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
                  required
                />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(event) => setRegPassword(event.target.value)}
                  placeholder={t("account.registerPasswordPlaceholder")}
                  className="w-full border border-zinc-300 bg-[#F8F4F3] px-4 py-3 text-sm text-[#1A1A1A]"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#5e000e] px-4 py-3 text-sm font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-[#7e1023] disabled:opacity-60"
                >
                  {loading ? t("account.processing") : t("account.registerBtn")}
                </button>
              </form>
            )}
          </section>

          <section className="panel-surface p-6 text-sm text-zinc-600">
            {t("account.info")}
          </section>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="panel-surface p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">{t("account.loggedInAs")}</p>
            <p className="mt-2 text-lg text-[#1A1A1A]">{user.email}</p>
            <button
              type="button"
              onClick={onLogout}
              className="mt-6 border border-zinc-300 px-4 py-2 text-xs uppercase tracking-[0.13em] text-zinc-700 transition hover:border-[#5e000e] hover:text-[#5e000e]"
            >
              {t("account.logout")}
            </button>
          </aside>

          <section className="panel-surface p-6">
            <h2 className="brand-serif text-2xl tracking-[0.1em] text-[#1A1A1A]">{t("account.wishlistTitle")}</h2>
            {wishlist.length === 0 ? (
              <p className="mt-4 text-zinc-400">{t("account.wishlistEmpty")}</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {wishlist.map((item) => (
                  <Link
                    key={item.productId}
                    href={item.categorySlug ? getProductPath(item.categorySlug, item.slug) : `/product/${item.slug}`}
                    className="border border-zinc-300 bg-black/5 p-4 transition hover:border-[#5e000e]"
                  >
                    <p className="text-sm font-semibold text-[#1A1A1A]">{item.title}</p>
                    {typeof item.price === "number" ? (
                      <p className="mt-1 text-sm text-[#d7b4bb]">{item.price.toFixed(2)} {t("common.mdl")}</p>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
