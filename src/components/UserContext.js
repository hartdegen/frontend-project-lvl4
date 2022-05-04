import { createContext } from "react";

export default createContext({
    isAuth: () => localStorage.getItem("token") !== null,
});
