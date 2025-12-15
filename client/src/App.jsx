import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import api from "./configs/api.js";
import { login, setLoading } from "./app/features/authSlice.js";
const Home = lazy(() => import("./pages/Home.jsx"));
const Layout = lazy(() => import("./pages/Layout.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder.jsx"));
const Preview = lazy(() => import("./pages/Preview.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
import { Toaster } from "react-hot-toast";

const App = () => {
  const dispatch = useDispatch();

  const getUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        const { data } = await api.get("/api/users/data", {
          headers: { Authorization: token },
        });
        if (data.user) {
          dispatch(login({ token, user: data.user}));
        }
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error.message);
    }
  };


  useEffect(() => {
    getUserData();
  },[])

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="builder/:resumeId" element={<ResumeBuilder />} />
          </Route>

          <Route path="view/:resumeId" element={<Preview />} />
          
          
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
