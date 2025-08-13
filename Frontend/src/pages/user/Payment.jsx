import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useElements,
  useStripe,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "../../lib/axios";
import { Navbar } from "../../components/ui/required/Navbar";
import { Button } from "../../components/ui/button";

// Provide your publishable key via environment variable in Vite: VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const bookingDetails = state?.bookingDetails;
  const venue = state?.venue;

  const amountDisplay = useMemo(() => {
    if (!bookingDetails) return 0;
    if (typeof bookingDetails.totalAmount === "number")
      return bookingDetails.totalAmount;
    const hours = Number(bookingDetails?.duration) || 0;
    const pricePerHour =
      Number(bookingDetails?.pricePerHour ?? venue?.startingPrice) || 0;
    return hours * pricePerHour;
  }, [bookingDetails, venue?.startingPrice]);

  useEffect(() => {
    if (!venue || !bookingDetails) {
      navigate(`/venue/${id}/book`, { replace: true });
    }
  }, [venue, bookingDetails, id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);
    setErrorMessage("");

    try {
      // 1) Create PaymentIntent on server
      const intentRes = await axiosInstance.post(
        "/payments/intent",
        {
          facilityId: venue?.id,
          sportType: bookingDetails?.selectedSport,
          date: bookingDetails?.selectedDate,
          startTime: bookingDetails?.startTime,
          durationHours: bookingDetails?.duration,
          amountOverride: amountDisplay,
        },
        { withCredentials: true }
      );

      const clientSecret = intentRes.data?.data?.clientSecret;
      const paymentIntentId = intentRes.data?.data?.paymentIntentId;

      // 2) Confirm card payment via Stripe Elements
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Payment failed");
        setIsLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        // 3) Finalize on server to create booking
        await axiosInstance.post(
          "/payments/finalize",
          { paymentIntentId },
          { withCredentials: true }
        );

        setIsSuccess(true);
      } else {
        setErrorMessage("Payment not completed");
      }
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || "Payment failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">
            {isSuccess ? "Payment Successful" : "Secure Payment"}
          </h1>
          <p className="text-green-600 font-medium">
            {isSuccess
              ? "Your booking has been confirmed."
              : "Complete your booking with Stripe"}
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6 mb-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">
            Booking Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-green-800">
            <div>
              <p className="font-semibold">Venue</p>
              <p>{venue?.name}</p>
            </div>
            <div>
              <p className="font-semibold">Sport</p>
              <p>{bookingDetails?.selectedSport}</p>
            </div>
            <div>
              <p className="font-semibold">Date</p>
              <p>{bookingDetails?.selectedDate}</p>
            </div>
            <div>
              <p className="font-semibold">Start Time</p>
              <p>{bookingDetails?.startTime}</p>
            </div>
            <div>
              <p className="font-semibold">Duration</p>
              <p>{bookingDetails?.duration} hour(s)</p>
            </div>
            <div>
              <p className="font-semibold">Amount</p>
              <p className="text-2xl font-bold text-green-800">
                ₹{amountDisplay}
              </p>
            </div>
          </div>
        </div>

        {/* Success state or Card form */}
        {isSuccess ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6 space-y-6 text-center">
            <div className="text-green-700 text-lg font-semibold">
              Payment successful! Your booking has been created.
            </div>
            <Button
              onClick={() => navigate(`/edit-profile?tab=bookings`)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl"
            >
              View Bookings
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6 space-y-6"
          >
            <div>
              <label className="block text-lg font-semibold text-green-800 mb-3">
                Card details
              </label>
              <div className="border-2 border-green-200 rounded-xl p-3 bg-white">
                <CardElement options={{ hidePostalCode: true }} />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !stripe || !elements}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? "Processing..." : `Pay ₹${amountDisplay}`}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
