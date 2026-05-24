"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CartItem } from "@/lib/strapi";

interface CheckoutForm {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  paymentMethod: "cash" | "transfer";
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function generateOrderNumber() {
  return `CL-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CheckoutForm>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCity: "",
    paymentMethod: "cash",
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart.length, router]);

  if (cart.length === 0) {
    return <div className="mx-auto max-w-7xl px-4 py-8 text-zinc-400">Se încarcă...</div>;
  }

  const total = cart.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.customerName || !form.customerEmail || !form.customerPhone || !form.customerAddress) {
      setError("Completează toate câmpurile obligatorii");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.customerEmail)) {
      setError("Adresa de email nu este validă");
      setLoading(false);
      return;
    }

    if (form.customerPhone.length < 8) {
      setError("Numărul de telefon nu este valid");
      setLoading(false);
      return;
    }

    try {
      const orderNumber = generateOrderNumber();

      const response = await fetch(`${STRAPI_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            orderNumber,
            customerName: form.customerName,
            customerEmail: form.customerEmail,
            total,
            status: "pending",
          },
        }),
      });

      const raw = await response.text();
      const data = (() => {
        try {
          return JSON.parse(raw) as { data?: { orderNumber?: string }; error?: { message?: string } };
        } catch {
          return null;
        }
      })();

      if (!response.ok) {
        throw new Error(data?.error?.message || raw || "Eroare la plasarea comenzii");
      }

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      router.push(`/order-confirmation?order=${data?.data?.orderNumber || orderNumber}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare la plasarea comenzii");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-zinc-700 bg-black px-4 py-3 text-sm text-white placeholder-zinc-500 transition focus:border-[#5e000e] focus:outline-none";

  return (
    <div className="bg-[#09090c] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="brand-serif mb-10 text-3xl tracking-[0.12em] text-white">Finalizează comanda</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-zinc-400">
                Nume și prenume *
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className={inputClass}
                placeholder="Ex: Ion Popescu"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-zinc-400">
                Email *
              </label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                className={inputClass}
                placeholder="exemplu@email.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-zinc-400">
                Telefon *
              </label>
              <input
                type="tel"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className={inputClass}
                placeholder="+373 69 123 456"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-zinc-400">
                Adresă de livrare *
              </label>
              <input
                type="text"
                value={form.customerAddress}
                onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                className={inputClass}
                placeholder="Strada, număr, bloc, apartament"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-zinc-400">
                Oraș *
              </label>
              <input
                type="text"
                value={form.customerCity}
                onChange={(e) => setForm({ ...form, customerCity: e.target.value })}
                className={inputClass}
                placeholder="Chișinău"
                required
              />
            </div>

            <div>
              <label className="mb-3 block text-xs uppercase tracking-wider text-zinc-400">
                Metodă de plată
              </label>
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center gap-3 border border-zinc-700 bg-black p-3 text-sm text-zinc-200 transition hover:border-zinc-500">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={form.paymentMethod === "cash"}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value as CheckoutForm["paymentMethod"] })
                    }
                    className="accent-[#5e000e]"
                  />
                  <span>Plată la livrare (cash)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 border border-zinc-700 bg-black p-3 text-sm text-zinc-200 transition hover:border-zinc-500">
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={form.paymentMethod === "transfer"}
                    onChange={(e) =>
                      setForm({ ...form, paymentMethod: e.target.value as CheckoutForm["paymentMethod"] })
                    }
                    className="accent-[#5e000e]"
                  />
                  <span>Transfer bancar</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5e000e] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#7e1023] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Se procesează..." : `Plasează comanda (${total.toFixed(2)} MDL)`}
            </button>
          </form>

          <div className="h-fit border border-zinc-800 bg-[#121216] p-6">
            <h2 className="brand-serif mb-6 text-xl tracking-[0.1em] text-white">Sumar comandă</h2>

            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm text-zinc-300">
                  <span>
                    {item.titleSnapshot}{" "}
                    <span className="text-zinc-500">x{item.quantity}</span>
                  </span>
                  <span>{(item.priceSnapshot * item.quantity).toFixed(2)} MDL</span>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-zinc-800 pt-6">
              <div className="flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span className="text-[#5e000e]">{total.toFixed(2)} MDL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
