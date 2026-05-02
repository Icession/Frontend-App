import { Axios } from "axios";
import { myAxios } from "./helper";

export const register = (user) => {
    return myAxios.post("/api/users/register", user).then((response) => response.data);
};