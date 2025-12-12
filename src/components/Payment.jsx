import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const Payments = () => {
    const SECRET = "YOUR_SECRET_KEY"; // replace with actual eSewa secret key

    const [formData, setFormData] = useState({
        amount: "100",
        tax_amount: "10",
        total_amount: "110",
        transaction_uuid: "",
        product_code: "EPAYTEST",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "https://developer.esewa.com.np/success",
        failure_url: "https://developer.esewa.com.np/failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: ""
    });

    // Generate UUID + Signature when amount/product_code changes
    useEffect(() => {
        generateUuid();
    }, []);

    useEffect(() => {
        generateSignature();
    }, [formData.total_amount, formData.transaction_uuid, formData.product_code]);

    /** Generate transaction UUID */
    const generateUuid = () => {
        const now = new Date();
        const uuid =
            now.toISOString().slice(2, 10).replace(/-/g, "") +
            "-" +
            now.getHours() +
            now.getMinutes() +
            now.getSeconds();

        setFormData((prev) => ({ ...prev, transaction_uuid: uuid }));
    };

    /** Generate HMAC Signature */
    const generateSignature = () => {
        if (!formData.transaction_uuid) return;

        const rawString = `total_amount=${formData.total_amount},transaction_uuid=${formData.transaction_uuid},product_code=${formData.product_code}`;

        const hash = CryptoJS.HmacSHA256(rawString, SECRET);
        const signatureBase64 = CryptoJS.enc.Base64.stringify(hash);

        setFormData((prev) => ({ ...prev, signature: signatureBase64 }));
    };

    return (
        <form
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            className="flex flex-col gap-3 border p-4"
        >
            <input name="amount" value={formData.amount} readOnly />
            <input name="tax_amount" value={formData.tax_amount} readOnly />
            <input name="total_amount" value={formData.total_amount} readOnly />
            <input name="transaction_uuid" value={formData.transaction_uuid} readOnly />
            <input name="product_code" value={formData.product_code} readOnly />
            <input name="product_service_charge" value={formData.product_service_charge} readOnly />
            <input name="product_delivery_charge" value={formData.product_delivery_charge} readOnly />
            <input name="success_url" value={formData.success_url} readOnly />
            <input name="failure_url" value={formData.failure_url} readOnly />
            <input name="signed_field_names" value={formData.signed_field_names} readOnly />
            <input name="signature" value={formData.signature} readOnly />

            <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Pay with eSewa
            </button>
        </form>
    );
};

export default Payments;
