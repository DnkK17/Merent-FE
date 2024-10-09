import axios from "axios";

export const api = axios.create({
    baseURL: "https://merent.uydev.id.vn/api"
});

