import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, Heart } from "lucide-react";

import { useTextBlock } from "../hooks/useTextBlock";

export default function Footer() {
  const whatWeDoTitle = useTextBlock("What We Do Title");
  const whatWeDo1 = useTextBlock("What We Do 1");
  const whatWeDo2 = useTextBlock("What We Do 2");
  const whatWeDo3 = useTextBlock("What We Do 3");
  const whatWeDo4 = useTextBlock("What We Do 4");
  const siteTitle = useTextBlock("Site Title");
  const siteTagline = useTextBlock("Site Tagline");
  const homepageSubheading = useTextBlock("Homepage Subheading");
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center shadow-lg">
                <img src="/images/logo.png" alt="TPC Logo" className="w-10 h-10 object-contain rounded-lg" />
              </div>
              <div>
                <div className="font-bold text-lg sm:text-xl">
                  {siteTitle}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">
                  {siteTagline}
                </div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              {homepageSubheading}
            </p>

            <div className="flex space-x-4">
              <a href="https://instagram.com/turningpoint_Community" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:official.turningpointCommunity@gmail.com"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="tel:+919725567871"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-primary">{useTextBlock("Footer Quick Links Title", "Quick Links")}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  to="/events"
                  className="hover:text-primary transition-colors"
                >
                  {useTextBlock("Footer Link Events", "Events")}
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="hover:text-primary transition-colors"
                >
                  {useTextBlock("Footer Link Our Team", "Our Team")}
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-primary transition-colors"
                >
                  {useTextBlock("Footer Link Gallery", "Gallery")}
                </Link>
              </li>
            </ul>
          </div>

          {/* What We Do */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-primary">{whatWeDoTitle}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>{whatWeDo1}</li>
              <li>{whatWeDo2}</li>
              <li>{whatWeDo3}</li>
              <li>{whatWeDo4}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-primary">{useTextBlock("Footer Contact Us Title", "Contact Us")}</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-2 w-2 text-primary" />
                <span className="text-sm">{useTextBlock("Footer Contact Email", "official.turningpointCommunity@gmail.com")}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
  <Phone className="h-4 w-4 text-primary" />
  <span className="text-sm font-medium">{useTextBlock("Footer Contact Name 1", "Dhruv Rao")}:</span>
  <span className="text-sm">{useTextBlock("Footer Contact Phone 1", "+91 97255 67871")}</span>
</div>
<div className="flex items-center space-x-2">
  <Phone className="h-4 w-4 text-primary" />
  <span className="text-sm font-medium">{useTextBlock("Footer Contact Name 2", "Paalk")}:</span>
  <span className="text-sm">{useTextBlock("Footer Contact Phone 2", "+91 88665 88491")}</span>
</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center justify-center">
            <span className="text-lg text-gray-400 ml-2" aria-label="Copyright">©</span>
              <span className="text-gray-400 text-sm">
                {useTextBlock("Footer Copyright", "2025 Turning Point Community. All rights reserved.")}
              </span>
       
            </div>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>{useTextBlock("Footer Made With", "Made with")}</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>{useTextBlock("Footer For India's Youth", "for India's Youth")}</span>
            </div>
          
          </div>
        </div>
      </div>
    </footer>
  );
} 