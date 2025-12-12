import axios from "axios"

export const esewaPayment = async (data) => {
    const response = axios.post("http://localhost:8080/api/payment/generate-signature", JSON.stringify(data), {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json"
        },

    });
    return response;
}


export const esewaPaymentResponse = async (transaction_uuid, product_code, total_amount) => {
    const response = axios.get(`https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`);
    return response;
}