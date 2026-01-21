import axios from "axios"

export const fetchCommunity = async () => {
    const response = await axios.get("http://localhost:8080/api/community", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.data;
}


export const fetchMessages = async (communityId, pageNumber, pageSize) => {
    const response = await axios.get(`http://localhost:8080/api/${communityId}/chat?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
    });
    return response.data;
}