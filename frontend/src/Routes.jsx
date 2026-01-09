import React, { useEffect } from "react";
import {useNavigate, useRoutes} from "react-router-dom";

// page list
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Profile from "./components/user/Profile";

// auth context
import {useAuth} from "./authContext.jsx";

const ProjectRoutes = () => {
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Check for user in localStorage on component mount
        const storedUser = localStorage.getItem("userId");
        if (storedUser && !currentUser) {
            // If user data exists in localStorage and not in context, set it in context
            setCurrentUser(storedUser);
        }

        if (!storedUser && !["/login", "/signup"].includes(window.location.pathname)) {
            // If no user is found and trying to access protected routes, redirect to auth page
            navigate("/auth");
        }

        if(storedUser && window.location.pathname==="/auth") {
            // If user is logged in and tries to access auth routes, redirect to dashboard page
            navigate("/");
        }

    }, [navigate, currentUser, setCurrentUser]);

    let element = useRoutes([
        {path: "/", element: <Dashboard />},
        {path: "/auth", element: <Login />},
        {path: "/signup", element: <SignUp />},
        {path: "/profile", element: <Profile />},
    ]);

    return element;
}

export default ProjectRoutes;
