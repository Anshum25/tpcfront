import { useState, useEffect } from "react";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Send,
  Clock,
  Users,
  MessageCircle,
} from "lucide-react";
import { useTextBlock } from "@/hooks/useTextBlock";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/contact-submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to submit. Please try again.");
      setSubmitStatus("Your message has been sent! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setSubmitStatus(err.message || "Submission failed. Try again later.");
    }
  };


  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "official.turningpointCommunity@gmail.com",
      description: "Send us your queries and we'll respond within 24 hours",
      color: "text-blue-600",
      bg: "bg-blue-100",
      onClick: () => window.location.href = 'mailto:official.turningpointCommunity@gmail.com',
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 97255 67871",
      description: "Aditya Bhatt - President & Founder",
      color: "text-green-600",
      bg: "bg-green-100",
      onClick: () => {
        // Open WhatsApp if on mobile, otherwise open phone dialer
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.open(`https://wa.me/919725567871`, '_blank');
        } else {
          window.location.href = 'tel:+919725567871';
        }
      },
    },
    {
      icon: Phone,
      title: "Alternative Contact",
      details: "+91 88665 88491",
      description: "Kavya Chokshi - Vice President",
      color: "text-purple-600",
      bg: "bg-purple-100",
      onClick: () => {
        // Open WhatsApp if on mobile, otherwise open phone dialer
        if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          window.open(`https://wa.me/918866588491`, '_blank');
        } else {
          window.location.href = 'tel:+918866588491';
        }
      },
    },
    {
      icon: Instagram,
      title: "Follow Us",
      details: "@turningpoint_Community",
      description: "Stay updated with our latest events and activities",
      color: "text-pink-600",
      bg: "bg-pink-100",
      onClick: () => {
        window.open('https://www.instagram.com/turningpoint_Community', '_blank');
      },
    },
  ];

  const teamContacts = [
    {
      name: "Aditya Bhatt",
      position: "President & Founder",
      phone: "+91 97255 67871",
      email: "aditya@turningpointCommunity.org",
      image:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg",
    },
    {
      name: "Kavya Chokshi",
      position: "Vice President",
      phone: "+91 88665 88491",
      email: "kavya@turningpointCommunity.org",
      image:
        "https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpg",
    },
    {
      name: "Dev Babani",
      position: "Secretary General",
      phone: "+91 9737224255",
      email: "dev@turningpointCommunity.org",
      image:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    },
  ];

  const contactSectionTitle = useTextBlock("Contact Section Title");
  const contactSectionSubheading = useTextBlock("Contact Section Subheading");
  const contactFormTitle = useTextBlock("Contact Form Title");
  const contactFormSubheading = useTextBlock("Contact Form Subheading");
  const contactFormName = useTextBlock("Contact Form Name");
  const contactFormEmail = useTextBlock("Contact Form Email");
  const contactFormPhone = useTextBlock("Contact Form Phone");
  const contactFormSubject = useTextBlock("Contact Form Subject");
  const contactFormMessage = useTextBlock("Contact Form Message");
  const contactFormButton = useTextBlock("Contact Form Button");

  // Dynamic Contact Us Carousel Images
  function useCarouselImages(partPrefix: string) {
    const [images, setImages] = useState<string[]>([]);
    useEffect(() => {
      apiService.getImages().then(allImages => {
        setImages(
          allImages
            .filter(img => img.part && img.part.startsWith(partPrefix))
            .sort((a, b) => {
              const getNum = (part: string) => parseInt(part.replace(/\D/g, "")) || 0;
              return getNum(a.part!) - getNum(b.part!);
            })
            .map(img => img.url.startsWith("/uploads/") ? `${import.meta.env.VITE_API_URL}${img.url}` : img.url)
        );
      });
    }, [partPrefix]);
    return images;
  }

  const heroImages = useCarouselImages("Contact Us Carousel");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleImages = heroImages.length > 0 ? [heroImages[carouselIndex % heroImages.length]] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden" style={{ minHeight: 'calc(14rem + 4cm)' }}>
        <div className="absolute inset-0 flex">
          {visibleImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={`Contact Hero ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ))}
          <button onClick={() => setCarouselIndex((carouselIndex - 1 + heroImages.length) % heroImages.length)} className="absolute left-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{"<"}</button>
          <button onClick={() => setCarouselIndex((carouselIndex + 1) % heroImages.length)} className="absolute right-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{">"}</button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90"></div>
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-4 md:left-20 w-24 md:w-32 h-24 md:h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-40 right-4 md:right-20 w-16 md:w-24 h-16 md:h-24 bg-accent/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-56 md:h-72 lg:h-80">
          <div className="text-center space-y-6 md:space-y-8 text-white max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="bg-primary/20 text-white border-primary/30 px-4 md:px-6 py-2"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              {contactSectionTitle}
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Contact <span className="text-primary">Us</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
              {contactSectionSubheading}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-16 -mt-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 -z-10">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 bg-white p-1 md:p-4"
                onClick={info.onClick}
              >
                <CardHeader className="pb-1 md:pb-4">
                  <div
                    className={`inline-flex items-center justify-center w-8 h-8 md:w-16 md:h-16 ${info.bg} rounded-full mx-auto mb-1 md:mb-4`}
                  >
                    <info.icon
                      className={`h-4 w-4 md:h-8 md:w-8 ${info.color}`}
                    />
                  </div>
                  {/* Instagram @ handle below icon, above title, only for Instagram */}
                  {info.title === "Follow Us" && (
                    <div className="text-[10px] md:text-xs text-muted-foreground mb-1">@turningpoint_Community</div>
                  )}
                  <CardTitle className="text-sm md:text-xl">
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Hide details for Instagram card since @ is above */}
                  {info.title !== "Follow Us" && (
                    <p className="font-medium text-primary mb-1 md:mb-2 text-xs md:text-base break-all">
                      {info.details}
                    </p>
                  )}
                  <p className="text-[10px] md:text-sm text-muted-foreground leading-relaxed">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-2 md:py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: Heading, description, response time (desktop only) */}
            <div className="space-y-8">
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold">{contactFormTitle}</h2>
                <p className="text-sm md:text-lg text-muted-foreground">
                  {contactFormSubheading}
                </p>
              </div>
              {/* Response Time Card for desktop only */}
              <div className="hidden md:block max-w-md mx-auto md:mx-0">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span>Response Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        We typically respond to inquiries within:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span><strong>Email:</strong> 24 hours</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span><strong>Phone:</strong> Immediate during business hours</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span><strong>Social Media:</strong> 2-4 hours</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* Right: Contact Form and Response Time (mobile only) */}
            <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
              <Card>
                <CardContent className="p-3 md:p-6">
                  <form id="contact-form" onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm md:text-xl">{contactFormName}</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" required className="h-10 md:h-14 text-sm md:text-xl px-3 md:px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm md:text-xl">{contactFormEmail}</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" required className="h-10 md:h-14 text-sm md:text-xl px-3 md:px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm md:text-xl">{contactFormPhone}</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className="h-10 md:h-14 text-sm md:text-xl px-3 md:px-6" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm md:text-xl">{contactFormSubject}</Label>
                        <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="What is this about?" required className="h-10 md:h-14 text-sm md:text-xl px-3 md:px-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm md:text-xl">{contactFormMessage}</Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us more about your inquiry..." rows={6} required className="text-sm md:text-xl px-3 md:px-6 py-2 md:py-4" />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-10 md:h-14 text-sm md:text-xl">
                      <Send className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                      {contactFormButton}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              {/* Response Time Card below form, very small, mobile only */}
              <Card className="bg-primary/5 border-primary/20 md:hidden">
                <CardHeader className="p-2">
                  <CardTitle className="flex items-center space-x-2 text-xs">
                    <Clock className="h-4 w-4" />
                    <span>Response Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs">
                      We typically respond to inquiries within:
                    </p>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span><strong>Email:</strong> 24 hours</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span><strong>Phone:</strong> Immediate during business hours</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span><strong>Social Media:</strong> 2-4 hours</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
