"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import {
  Order,
  CreatePaymentOrderResponse,
  VerifyPaymentResponse,
} from "../../types/order";

// ── Razorpay window type augmentation ───────────────────────────────────────
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ── Razorpay script loader ───────────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Checkout step type ───────────────────────────────────────────────────────
type CheckoutStep =
  | "cart"
  | "creating_order"
  | "awaiting_payment"
  | "verifying"
  | "success"
  | "failed";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const {
    items,
    subtotal,
    totalDiscount,
    totalAmount,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();

  const [shippingAddress, setShippingAddress] = useState("");
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [verifyResponse, setVerifyResponse] =
    useState<VerifyPaymentResponse | null>(null);

  const shippingFee =
    totalAmount >= 500 || totalAmount === 0 ? 0 : 49;
  const finalPayable = totalAmount + shippingFee;
  const rupee = "\u20B9";

  const isCheckingOut =
    checkoutStep === "creating_order" ||
    checkoutStep === "awaiting_payment" ||
    checkoutStep === "verifying";

  // ── Main checkout handler ─────────────────────────────────────────────────
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!isAuthenticated) {
      router.push("/login?redirect=/cart");
      return;
    }

    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      setCheckoutError(
        "Please enter a valid delivery address (at least 5 characters)."
      );
      return;
    }

    try {
      // Step 1: Create BOOKLY order (atomic — stock reserved)
      setCheckoutStep("creating_order");
      const order = await api.checkout({
        shippingAddress: shippingAddress.trim(),
      });
      setCreatedOrder(order);
      await refreshCart();

      // Step 2: Create Razorpay payment order (amount taken from server)
      let paymentOrder: CreatePaymentOrderResponse;
      try {
        paymentOrder = await api.createPaymentOrder(order.id);
      } catch (payErr: any) {
        // If Razorpay isn't configured, still show order success so order isn't lost
        if (
          payErr.message?.includes("not configured") ||
          payErr.message?.includes("gateway")
        ) {
          setCheckoutStep("success");
          setVerifyResponse({
            success: true,
            message:
              "Order placed! Payment gateway is not yet configured — contact support to complete payment.",
            orderId: order.id,
            orderNumber: order.orderNumber,
            paymentStatus: "PENDING",
            orderStatus: order.orderStatus,
          });
          return;
        }
        throw payErr;
      }

      // Step 3: Load Razorpay checkout script
      setCheckoutStep("awaiting_payment");
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Failed to load payment gateway. Please check your internet connection and try again."
        );
      }

      // Step 4: Open Razorpay checkout modal
      await openRazorpayCheckout(paymentOrder, order);
    } catch (err: any) {
      setCheckoutError(
        err.message || "Checkout failed. Please review your cart and try again."
      );
      setCheckoutStep("cart");
    }
  };

  // ── Razorpay checkout modal opener ───────────────────────────────────────
  const openRazorpayCheckout = (
    paymentOrder: CreatePaymentOrderResponse,
    order: Order
  ): Promise<void> => {
    return new Promise((resolve) => {
      const options = {
        key: paymentOrder.keyId, // Public key — safe for browser
        amount: paymentOrder.amount, // In paise (server-calculated)
        currency: paymentOrder.currency,
        name: "BOOKLY",
        description: `Order ${paymentOrder.orderNumber}`,
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#4f46e5", // Indigo brand colour
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Step 5: Verify signature on the backend (NEVER on frontend)
          setCheckoutStep("verifying");
          try {
            const verified = await api.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              booklyOrderId: order.id,
            });
            setVerifyResponse(verified);
            setCheckoutStep("success");
          } catch (verifyErr: any) {
            setCheckoutError(
              verifyErr.message ||
                "Payment verification failed. Please contact support with your order number: " +
                  order.orderNumber
            );
            setCheckoutStep("failed");
          }
          resolve();
        },
        modal: {
          ondismiss: () => {
            // User closed modal without completing payment — order still exists
            setCheckoutError(
              `Payment window closed. Your order ${order.orderNumber} is saved. You can retry payment from your order history.`
            );
            setCheckoutStep("cart");
            resolve();
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setCheckoutError(
          `Payment failed: ${resp.error?.description || "Unknown error"}. Order ${order.orderNumber} is saved.`
        );
        setCheckoutStep("failed");
        resolve();
      });
      rzp.open();
    });
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (checkoutStep === "success" && verifyResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/20 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-5xl">✅</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {verifyResponse.paymentStatus === "PAID"
              ? "Payment Successful!"
              : "Order Placed!"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {verifyResponse.message}
          </p>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Order Number</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {verifyResponse.orderNumber}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Order Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                {verifyResponse.orderStatus}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Payment Status</span>
              <span
                className={`font-semibold ${verifyResponse.paymentStatus === "PAID" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
              >
                {verifyResponse.paymentStatus}
              </span>
            </div>
            {createdOrder && (
              <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-black text-slate-900 dark:text-white">
                  {rupee}
                  {createdOrder.finalAmount}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/orders/${verifyResponse.orderId}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition"
            >
              View Order Details
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Payment failed screen ─────────────────────────────────────────────────
  if (checkoutStep === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-rose-50/30 dark:from-slate-950 dark:to-rose-950/20 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">❌</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            Payment Failed
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {checkoutError ||
              "Your payment could not be processed. Your order is saved."}
          </p>
          {createdOrder && (
            <p className="text-sm text-slate-500 mb-6">
              Order:{" "}
              <span className="font-mono font-bold">
                {createdOrder.orderNumber}
              </span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {createdOrder && (
              <Link
                href={`/orders/${createdOrder.id}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg transition"
              >
                View Order
              </Link>
            )}
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main cart + checkout form ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/20 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Shopping Cart
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Review your items and complete checkout
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 mb-8">
              Discover great books and add them to your cart.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition"
            >
              Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => {
                const dp =
                  item.book?.discount > 0
                    ? Math.round(
                        item.book.price * (1 - item.book.discount / 100)
                      )
                    : item.book?.price || 0;

                return (
                  <div
                    key={item.bookId}
                    className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-20 h-28 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        {item.book?.coverImage ? (
                          <img
                            src={item.book.coverImage}
                            alt={item.book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            Cover
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 min-w-0">
                        <Link
                          href={"/books/" + item.bookId}
                          className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
                        >
                          {item.book?.title}
                        </Link>
                        <p className="text-xs text-slate-500">
                          Author: {item.book?.author}
                        </p>
                        <p className="text-xs font-mono text-slate-400">
                          ISBN: {item.book?.isbn}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {rupee}
                            {dp}
                          </span>
                          {item.book?.discount > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              {rupee}
                              {item.book.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                      <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                        <button
                          onClick={() =>
                            updateQuantity(item.bookId, item.quantity - 1)
                          }
                          className="px-3 py-1 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          -
                        </button>
                        <span className="px-3.5 py-1 text-xs font-bold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.bookId, item.quantity + 1)
                          }
                          className="px-3 py-1 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-900 dark:text-white block">
                          {rupee}
                          {dp * item.quantity}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.bookId)}
                          className="text-xs text-rose-500 hover:underline mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout & Summary Form */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                Checkout & Summary
              </h3>

              {/* Step indicator */}
              {isCheckingOut && (
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-xl flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {checkoutStep === "creating_order" &&
                    "Reserving your items..."}
                  {checkoutStep === "awaiting_payment" &&
                    "Opening payment gateway..."}
                  {checkoutStep === "verifying" && "Verifying payment..."}
                </div>
              )}

              {checkoutError && !isCheckingOut && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
                  {checkoutError}
                </div>
              )}

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Delivery Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    disabled={isCheckingOut}
                    placeholder="Enter your complete street address, city, state, pin code..."
                    className="w-full p-3 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2.5 text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {rupee}
                      {subtotal}
                    </span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Savings</span>
                      <span className="font-semibold">
                        -{rupee}
                        {Math.round(totalDiscount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          FREE
                        </span>
                      ) : (
                        `${rupee}${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-lg font-black text-slate-900 dark:text-white">
                    <span>Total Payable</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      {rupee}
                      {Math.round(finalPayable)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingOut}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      {checkoutStep === "creating_order" && "Placing Order..."}
                      {checkoutStep === "awaiting_payment" &&
                        "Loading Payment..."}
                      {checkoutStep === "verifying" && "Verifying Payment..."}
                    </span>
                  ) : (
                    <span>
                      Pay with Razorpay ({rupee}
                      {Math.round(finalPayable)})
                    </span>
                  )}
                </button>
              </form>

              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                <span>🔒</span> Secure payment via Razorpay. Signature verified
                server-side.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
