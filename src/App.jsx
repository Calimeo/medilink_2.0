import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContext from "./Context/Context.jsx";
import {
  Navbar,
  Footer,
  HomePage,
  AllDoctorsPage,
  SpecialitiesPage,
  MedicinesPage,
  LoginPage,
  SignupPage,
  ErrorPage,
  FaqsPage,
  AboutUsPage,
  PrivacyPolicyPage,
  TermsAndConditionsPage,
  MyPurchasesPage,
  Appointment,
  CartPage,
  ProductsByCategory,
  SingleMedicine,
  GoToTop,
  Bot,
  SendAppointmentPage,
  ProfilePage,
  PatientAppointmentsPage,
  DoctorSearchPage,
  FollowedDoctorsPage,
  ChatPage,
  PharmacyStorePage,
  PatientBookingPage,
  PatientDoctorAvailability,
} from "./import-export/ImportExport.js";

// 🔁 Wrapper pour pouvoir utiliser useLocation()
const AppWrapper = () => {
  const location = useLocation();

  // Liste des routes où on ne veut pas afficher Navbar, Footer, etc.
  const noLayoutRoutes = ["/login", "/signup"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/alldoctors" element={<AllDoctorsPage />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/specialities" element={<SpecialitiesPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/medicines/shop_by_category/:id" element={<ProductsByCategory />} />
        <Route path="/buy-medicines/:id" element={<SingleMedicine />} />
        <Route path="/medicines/cart" element={<CartPage />} />
        <Route path="/medicines/order_history" element={<MyPurchasesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
        <Route path="/termsandconditions" element={<TermsAndConditionsPage />} />
        <Route path="/appointments" element={<PatientAppointmentsPage />} />
        <Route path="/doctor/search" element={<DoctorSearchPage />} />
        <Route path="/doctor/follow" element={<FollowedDoctorsPage />} />
        <Route path="/message" element={<ChatPage />} />
        <Route path="/pharmacy" element={<PharmacyStorePage />} />
        <Route path="/send-appointment/:doctorId" element={<SendAppointmentPage />} />
        <Route path="/book"  element={<PatientBookingPage />} />
        <Route path="/booking/doctor" element={<PatientDoctorAvailability />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>

      {!hideLayout && <Bot />}
      {!hideLayout && <GoToTop />}
      {!hideLayout && <Footer />}
      <ToastContainer position="top-right" />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <AppWrapper />
      </AppContext>
    </BrowserRouter>
  );
}

export default App;
