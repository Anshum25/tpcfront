import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogOut, User, Home, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import { useTextBlock } from "../hooks/useTextBlock";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Team", path: "/team" },
  { name: "Board of Advisors", path: "/board-of-advisors" },
  { name: "Gallery", path: "/gallery" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const isLoggedIn = !!user && isAdmin();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;
  const siteTitle = useTextBlock("Site Title");
  const siteTagline = useTextBlock("Site Tagline");

  return (
    <nav className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 fixed top-0 left-0 w-full z-50 border-b border-border">
      <div className="w-full px-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center justify-start h-16 pl-[0.5cm]">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <img src="/images/logo.png" alt="TPC Logo" className="w-8 sm:w-10 h-8 sm:h-10 object-contain" />
              <div className="hidden sm:block text-left">
                <div className="font-bold text-base sm:text-lg text-foreground">
                  {siteTitle}
                </div>
                <div className="text-xs text-muted-foreground">
                  {siteTagline}
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="text-sm font-medium"
                >
                  {useTextBlock(`Navbar Link ${item.name}`, item.name)}
                </Button>
              </Link>
            ))} 
          </div>

          {/* Contact Button on Right (Desktop Only) */}
          <div className="hidden lg:flex items-center ml-4 gap-2">
            {isLoggedIn && (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>Dashboard</Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            )}
            <Link to="/contact">
              <Button variant="outline" size="sm" className="flex items-center gap-2 mr-4">
                <Phone className="h-4 w-4" />
                <span>{useTextBlock("Navbar Contact", "Contact")}</span>
              </Button>
            </Link>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn && isAdminRoute && (
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>Dashboard</Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-1">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <img src="/images/logo.png" alt="TPC Logo" className="w-6 sm:w-8 h-6 sm:h-8 object-contain" />
                    <span className="font-bold text-base sm:text-lg">{useTextBlock("Navbar Brand Short", "TPC")}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className="w-full justify-start"
                      >
                        {useTextBlock(`Navbar Link ${item.name}`, item.name)}
                      </Button>
                    </Link>
                  ))}
                  {/* Contact Toggle Button */}
                  <Link to="/contact" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start flex items-center gap-2 mt-2">
                      <Phone className="h-4 w-4 mr-2" />
                      {useTextBlock("Navbar Contact", "Contact")}
                    </Button>
                  </Link>
                  <div className="pt-4 border-t">
                    {isLoggedIn && (
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            navigate("/admin");
                            setIsOpen(false);
                          }}
                        >
                          {useTextBlock("Navbar Dashboard", "Dashboard")}
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          {useTextBlock("Navbar Logout", "Logout")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
