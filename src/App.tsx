
import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyProfile from "./pages/PropertyProfile";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import News from "./pages/News";
import NewsPost from "./pages/NewsPost";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Tools from "./pages/Tools";
import Contact from "./pages/Contact";
import Communications from "./pages/Communications";
import MapInspiredLandingPage from "./pages/MapInspiredLanding";
import FrasaDevelopment from "./pages/FrasaDevelopment";
import Appointments from "./pages/Appointments";
import RootLayout from "./components/layout/RootLayout";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/map-landing" element={<MapInspiredLandingPage />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyProfile />} />
          <Route path="/properties/add" element={<AddProperty />} />
          <Route path="/properties/:id/edit" element={<EditProperty />} />
          <Route path="/frasa" element={<FrasaDevelopment />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsPost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/users" element={<Users />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/communications" element={<Communications />} />
        </Route>
      </Routes>
      <ScrollToTop />
      <Toaster />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;
