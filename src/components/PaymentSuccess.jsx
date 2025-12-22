import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const data = searchParams.get("data");
    useEffect(() => {
        console.log(data);
    }, [])
    return (
        <div>
            {data && (
                data
            )}
            Payment Success
        </div>
    )
}

export default PaymentSuccess;