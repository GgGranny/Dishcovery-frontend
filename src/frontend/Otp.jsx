import axios from "axios"
import { useState, useEffect } from "react"


const Otp = () => {
  const [otp, setOtp] = useState("");

  const handleOnChange = (e) => {
    let val = e.target.value;
    setOtp(val);
  }

  const handleSubmit = async () => {
    const response = await axios.get(`http://localhost:8080/register/verify-email/${otp}`);
    console.log(response)
  }
  return (
    <div className="h-screen bg-black text-white flex justify-center items-center flex-col gap-10">
      <h1>Verify your email.</h1>
      <input type="text" onChange={handleOnChange} name="otp" placeholder="Otp" value={otp} />

      <input type="submit" className="bg-blue-600 cursor-pointer rounded-sm h-8 w-15" onClick={handleSubmit} value="submit" />
    </div>
  )
}


export default Otp;