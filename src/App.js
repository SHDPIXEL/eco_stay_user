import React from "react";
import "./assets/css/style.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import MainHeader from "./pages/MainHeader.jsx";
import { ScrollToTop } from "./pages/ScrollToTop.jsx";
import BookYourStayPage from "./pages/BookYourStayPage.jsx";
import ReviewBooking from "./pages/ReviewBooking.jsx";
import Checkouts from "./pages/Checkouts.jsx";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import UserDashboard from "./pages/UserDashboard";
import AgentLogin from "./pages/AgentLogin.jsx";
import ThankYouPage from "./pages/ThankYou.jsx";

function Layout({ children }) {
  return (
    <>
      <MainHeader />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/">
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/book-your-stay"
            element={
              <Layout>
                <BookYourStayPage />
              </Layout>
            }
          />
          <Route
            path="/review-booking"
            element={
              <Layout>
                <ReviewBooking />
              </Layout>
            }
          />
          <Route
            path="/checkout"
            element={
              <Layout>
                <Checkouts />
              </Layout>
            }
          />
          <Route path="/thankyou" element={<ThankYouPage />} />
          {/* <Route path="/agent-login" element={<Layout></Layout>} /> */}
          <Route path="/agentlogin" element={<AgentLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <UserDashboard />
                  </Layout>
                }
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
