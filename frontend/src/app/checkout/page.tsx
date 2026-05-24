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
  paymentMethod: "cash" | "card_offline" | "transfer";
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

function createOrderNumber() {
  return `CL-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

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

  const total = cart.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate
    if (!form.customerName || !form.customerEmail || !form.customerPhone || !form.customerAddress) {
      setError("Completează toate câmpurile obligatorii");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.customerEmail)) {
      setError("Adresa de email nu este validă");
      setLoading(false);
      return;
    }

    // Phone validation (basic)
    if (form.customerPhone.length < 8) {
      setError("Numărul de telefon nu este valid");
      setLoading(false);
      return;
    }

    try {
      const orderNumber = createOrderNumber();

      const response = await fetch(`${STRAPI_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // Redirect to confirmation
      router.push(`/order-confirmation?order=${data?.data?.orderNumber || orderNumber}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare la plasarea comenzii");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Se încarcă...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizează comanda</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nume și prenume *
              </label>
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e000e] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e000e] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefon *
              </label>
              <input
                type="tel"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e000e] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresă de livrare *
              </label>
              <input
                type="text"
                value={form.customerAddress}
                onChange={(e) => setForm({ ...form, customerAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e000e] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Oraș *
              </label>
              <input
                type="text"
                value={form.customerCity}
                onChange={(e) => setForm({ ...form, customerCity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e000e] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metodă de plată
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={form.paymentMethod === "cash"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paymentMethod: e.target.value as CheckoutForm["paymentMethod"],
                      })
                    }
                    className="text-[#5e000e]"
                  />
                  <span>Plată la livrare (cash)</span>
                </label>
                <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={form.paymentMethod === "transfer"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        paymentMethod: e.target.value as CheckoutForm["paymentMethod"],
                      })
                    }
                    className="text-[#5e000e]"
                  />
                  <span>Transfer bancar</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5e000e] text-white py-3 rounded-lg font-semibold hover:bg-[#4a000b] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Se procesează..." : `Plasează comanda (${total.toFixed(2)} MDL)`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sumar comandă</h2>
          
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>
                  {item.titleSnapshot} x {item.quantity}
                </span>
                <span className="font-medium">
                  {(item.priceSnapshot * item.quantity).toFixed(2)} MDL
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-[#5e000e]">{total.toFixed(2)} MDL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
