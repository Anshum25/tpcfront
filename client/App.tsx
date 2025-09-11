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
import { Suspense, lazy } from "react";

const Events = lazy(() => import("./pages/Events"));
const Team = lazy(() => import("./pages/Team"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BoardOfAdvisors = lazy(() => import("./pages/BoardOfAdvisors"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
      staleTime: 0, // Always consider data stale by default
      refetchOnMount: true, // Always refetch on mount
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

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
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Suspense fallback={<LoadingScreen onComplete={() => {}} />}><Events /></Suspense>} />
        <Route path="/team" element={<Suspense fallback={<LoadingScreen onComplete={() => {}} />}><Team /></Suspense>} />
        <Route path="/board-of-advisors" element={<Suspense fallback={<LoadingScreen onComplete={() => {}} />}><BoardOfAdvisors /></Suspense>} />
        <Route path="/gallery" element={<Suspense fallback={<LoadingScreen onComplete={() => {}} />}><Gallery /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<LoadingScreen onComplete={() => {}} />}><Contact /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<LoadingScreen onComplete={() => {}} />}><Login /></Suspense>} />
        <Route
          path="/admin"
          element={<Suspense fallback={<LoadingScreen onComplete={() => {}} />}><Admin /></Suspense>}
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<Suspense fallback={<LoadingScreen onComplete={() => {}} />}><NotFound /></Suspense>} />
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
