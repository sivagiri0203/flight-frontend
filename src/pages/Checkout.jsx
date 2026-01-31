import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/common/Loader";
import { bookingById } from "../services/booking.service";
import { createOrder, verifyPayment } from "../services/payment.service";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    const existing = document.getElementById("razorpay-sdk");
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loadBooking() {
    setErr("");
    setLoading(true);
    try {
      const res = await bookingById(bookingId);
      setBooking(res.data.booking);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load booking");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  async function payNow() {
    setErr("");
    setPayLoading(true);

    try {
      // 1) Load Razorpay checkout script
      const ok = await loadRazorpayScript();
      if (!ok) {
        setErr("Razorpay SDK failed to load. Check internet/adblock.");
        setPayLoading(false);
        return;
      }

      // 2) Create order on backend
      // IMPORTANT: send exactly { bookingId }
      const orderRes = await createOrder(bookingId);

      // Your backend should return these:
      // data: { keyId, orderId, amount, currency }
      const { keyId, orderId, amount, currency } = orderRes.data;

      if (!keyId || !orderId) {
        throw new Error("Invalid create-order response (missing keyId/orderId)");
      }

      // 3) Open Razorpay checkout
      const options = {
        key: keyId,
        order_id: orderId,
        amount, // paise
        currency: currency || "INR",
        name: "FlyBook",
        description: `Booking ${booking?.pnr || ""}`,
        // optional prefill
        prefill: {
          name: booking?.user?.name || "",
          email: booking?.user?.email || "",
        },
        theme: { color: "#0f172a" },

        handler: async function (response) {
          // response contains:
          // razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            console.log("✅ Razorpay response:", response);

            const payload = {
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyRes = await verifyPayment(payload);

            alert(verifyRes.message || "Payment verified ✅");

            // reload booking from backend to show paymentStatus = paid
            await loadBooking();
          } catch (e) {
            console.error("❌ Verify error:", e?.response?.data || e);
            alert(e?.response?.data?.message || "Verification failed");
          } finally {
            setPayLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPayLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (resp) {
        console.error("❌ Payment failed:", resp?.error);
        setErr(resp?.error?.description || "Payment failed");
        setPayLoading(false);
      });

      rzp.open();
    } catch (e) {
      console.error("❌ payNow error:", e?.response?.data || e);
      setErr(e?.response?.data?.message || e.message || "Create order failed");
      setPayLoading(false);
    }
  }

  if (loading) return <Loader label="Loading checkout..." />;
  if (err && !booking)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100">
          {err}
        </div>
      </div>
    );

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Checkout
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">
          PNR: {booking?.pnr}
        </p>

        {err && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-100">
            {err}
          </div>
        )}

        <div className="mt-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="text-sm text-slate-700 dark:text-slate-200">
            Route: <b>{booking?.flight?.depIata}</b> →{" "}
            <b>{booking?.flight?.arrIata}</b>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-200">
            Flight:{" "}
            <b>
              {booking?.flight?.flightIata ||
                booking?.flight?.flightNumber ||
                "N/A"}
            </b>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-200">
            Amount: <b>₹{booking?.amount}</b>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-200">
            Payment status:{" "}
            <b className={booking?.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}>
              {booking?.paymentStatus}
            </b>
          </div>
        </div>

        <button
          onClick={payNow}
          disabled={payLoading || booking?.paymentStatus === "paid"}
          className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {booking?.paymentStatus === "paid"
            ? "Already Paid ✅"
            : payLoading
            ? "Opening Razorpay..."
            : "Pay with Razorpay"}
        </button>

        <button
          onClick={loadBooking}
          className="mt-3 w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-3 rounded-xl font-semibold hover:opacity-90"
        >
          Refresh Status
        </button>
      </div>
    </section>
  );
}
