import { myAxios } from "./helper";

export const register = (user) => {
    return myAxios.post("/users/register", user).then((response) => response.data);
};