import axios from "axios";

import { useNavigate } from "react-router-dom";
const apiUrl = "http://127.0.0.1:8000/api";

const axiosClient = axios.create({
    baseURL: apiUrl,
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;

    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.reload();
        } else if (response.status === 404) {
            const navigate = useNavigate();
            navigate("*");
        }

        throw error;
    }
);

export default axiosClient;
