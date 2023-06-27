import React from "react";
import Login from "../Users/Forms/Login";

const AuthRoute = ({children}) => {
    // get user from localStorage
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const isLoggedIn = user?.token ? true : false;

    if (!isLoggedIn) {
        return <Login />;
    }

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export default AuthRoute;