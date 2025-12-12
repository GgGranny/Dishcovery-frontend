import axios from "axios"

const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
}

export const request = async (method = "get", url, body = null, headers) => {
    try {
        const response = await axios({
            method: method,
            url: "http://localhost:8080/" + url,
            headers: headers,
            data: body
        });
        return response
        console.log("this is status: " + response.status);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error(" Trying to login with access token");
            await sendRefreshToken();
        }
    }
    return null
}

const sendRefreshToken = async () => {
    const refreshToken = getRefreshToken();
    console.log('hello')
    if (!refreshToken) {
        console.error("No Refresh Token");
    }
    try {
        const response = await axios.post("http://localhost:8080/api/auth/refresh",
            { refreshToken: refreshToken },
            { headers: { "Content-Type": "application/json" } });
        console.log(response);
        localStorage.removeItem("token");
        localStorage.setItem("token", response.data.token)
    } catch (error) {
        console.error("Refresh Token Exipred ");
    }
}