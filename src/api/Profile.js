import axios from "axios";


export const fetchProfile = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/user/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });
        return response.data.data;
    } catch (error) {
        console.error(error);
    }

}

export const decodeImage = async (data) => {
    if (data.startsWith("https://")) return;
    const decodedData = atob(data);
    const byteNumber = new Array(decodedData.length);
    for (let i = 0; i <= byteNumber.length - 1; i++) {
        byteNumber[i] = decodedData.charCodeAt(i);
    }
    const blob = new Blob([new Uint8Array(byteNumber)], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
}