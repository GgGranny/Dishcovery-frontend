import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const data = searchParams.get("data");

  useEffect(() => {
    console.log("Payment data:", data);

    const timer = setTimeout(() => {
      navigate("/homepage", {
        state: {
          paymentSuccess: true,
          message: "Premium upgraded successfully!",
        },
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [data, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for upgrading to Premium. Your account is now ready.
        </p>
        {data && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-6">
            <span className="font-medium">Reference:</span> {data}
          </div>
        )}
        <div className="text-sm text-gray-500">
          Redirecting to homepage in <span className="font-semibold">4</span> seconds...
        </div>
        <button
          onClick={() =>
            navigate("/homepage", {
              state: {
                paymentSuccess: true,
                message: "Premium upgraded successfully!",
              },
            })
          }
          className="mt-6 text-sm text-green-600 hover:text-green-800 underline transition"
        >
          Click here if not redirected
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;