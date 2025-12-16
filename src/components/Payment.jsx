import { useState } from "react";
import { esewaPayment } from "../api/Payment";

const Payment = () => {
    const [formData, setFormData] = useState({
        amount: 0,
        tax_amount: 0,
        transaction_uuid: Math.round(Math.random() * 99999).toString(),
        product_code: "EPAYTEST",
    })

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let total_amount = Number(formData.amount) + Number(formData.tax_amount);
            const data = {
                "total_amount": total_amount,
                "transaction_uuid": formData.transaction_uuid,
                "product_code": formData.product_code
            }
            const response = await esewaPayment(data);
            const { signature, signed_field_name } = response.data;
            const paymentData = {
                ...formData,
                total_amount: total_amount,
                product_service_charge: 0,
                product_delivery_charge: 0,
                success_url: `http://localhost:5173/payment/success?product-code=${formData.product_code}`,
                failure_url: "http://localhost:5173/payment/fail",
                signed_field_names: signed_field_name,
                signature: signature
            }
            const form = document.createElement("form");
            form.setAttribute("method", "POST");
            form.setAttribute("action", "https://rc-epay.esewa.com.np/api/epay/main/v2/form");

            Object.entries(paymentData).forEach(([key, value]) => {
                const input = document.createElement("input");
                input.type = "text";
                input.name = key;
                input.value = value;
                input.required = true
                form.appendChild(input);
            });
            console.log(formData);
            console.log(form);
            console.log(response);
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            console.error("faild to pay", error);
        }
    }

    return (
        <div className="border border-red-500 h-screen flex justify-center items-center">
            <form className="flex flex-col w-[50%]">
                <input className="bg-gray-300 outline-1 rounded mt-2" type="text" id="amount" name="amount" value={formData.amount} onChange={handleOnChange} required />
                <input className="bg-green-500 text-white outline-1 rounded mt-2" value="Submit" type="submit" onClick={handleSubmit} />
            </form>
        </div>
    )
}

export default Payment;