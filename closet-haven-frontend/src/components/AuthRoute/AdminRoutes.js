import React from "react";

const AdminRoutes = ({children}) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const isAdmin = user?.userFound?.isAdmin ? true : false;
    if (!isAdmin) {
        return <h1>Access Denied, Admin Zone</h1>
    }

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}

export default AdminRoutes;