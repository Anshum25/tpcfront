import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Team from "./pages/Team";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import BoardOfAdvisors from "./pages/BoardOfAdvisors";

const queryClient = new QueryClient();

// Placeholder components for missing pages
const About = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-16 md:py-20">
      <div className="text-center space-y-4 md:space-y-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
          About TPC
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          This page is under construction. Please check back soon for detailed
          information about our organization.
        </p>
        <div className="pt-8">
          <Link to="/">
            <Button size="lg">Back to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  // New: track homepage data readiness
  const [homepageReady, setHomepageReady] = useState(false);

  // Hide loading screen when homepageReady is true
  useEffect(() => {
    if (homepageReady) {
      setIsLoading(false);
    }
  }, [homepageReady]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Pass setHomepageReady to Index for homepage loading orchestration */}
        <Route path="/" element={<Index onHomepageReady={() => setHomepageReady(true)} />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/team" element={<Team />} />
        <Route path="/board-of-advisors" element={<BoardOfAdvisors />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={<Admin />}
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
