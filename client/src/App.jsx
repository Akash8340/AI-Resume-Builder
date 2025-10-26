import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const Home = lazy(() => import("./pages/Home.jsx"));
const Layout = lazy(() => import("./pages/Layout.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder.jsx"));
const Preview = lazy(() => import("./pages/Preview.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

const App = () => {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="builder/:resumeId" element={<ResumeBuilder/>} />
          </Route>

          <Route path="view/:resumeId" element={<Preview />} />
          <Route path="login" element={<Login />} />
          
          <Route path="*" element={<div>404 Not Found</div>} />

        </Routes>
      </Suspense>
    </>
  );
};

export default App;
