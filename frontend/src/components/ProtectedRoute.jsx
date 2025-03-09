import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { isAuthenticated } from "../utils/auth.js";

const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        isAuthenticated().then((loggedIn) => setAuth(loggedIn));
    }, []);

    if (auth === null) return

    if (!auth) {
        Swal.fire({
            title: "Access Denied!",
            text: "You must log in first.",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return <Navigate to="/login" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
