import { useState } from "react";
import { esewaPayment } from "../api/Payment";

const Payment = () => {
    const [formData, setFormData] = useState({
        amount: "",
        tax_amount: 0,
        transaction_uuid: Math.round(Math.random() * 99999).toString(),
        product_code: "EPAYTEST",
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let total_amount =
                Number(formData.amount) + Number(formData.tax_amount);

            const data = {
                total_amount,
                transaction_uuid: formData.transaction_uuid,
                product_code: formData.product_code,
            };

            const response = await esewaPayment(data);
            const { signature, signed_field_name } = response.data;

            const paymentData = {
                ...formData,
                total_amount,
                product_service_charge: 0,
                product_delivery_charge: 0,
                success_url:
                    "http://localhost:8080/api/payment/esewa/payment-success",
                failure_url:
                    "http://localhost:8080/api/payment/esewa/payment-failed",
                signed_field_names: signed_field_name,
                signature,
            };

            const form = document.createElement("form");
            form.method = "POST";
            form.action =
                "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

            Object.entries(paymentData).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error("Failed to pay", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#f2f7f4] flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="text-[#60bb46] text-3xl font-bold">
                        eSewa
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                        Secure Payment Gateway
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Amount (NPR)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleOnChange}
                            placeholder="Enter amount"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60bb46]"
                        />
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>NPR {formData.tax_amount}</span>
                        </div>
                        <div className="flex justify-between font-semibold mt-1">
                            <span>Total</span>
                            <span className="text-[#60bb46]">
                                NPR{" "}
                                {Number(formData.amount || 0) +
                                    Number(formData.tax_amount)}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#60bb46] hover:bg-[#4fa83a] text-white py-3 rounded-lg font-semibold transition duration-200"
                    >
                        Pay with eSewa
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-4">
                    Powered by eSewa • 100% Secure Payments
                </p>
            </div>
        </div>
    );
};

export default Payment;
