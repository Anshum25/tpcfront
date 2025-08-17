import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Users,
  Trophy,
  Target,
  BookOpen,
  Heart,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Star,
  Award,
  Globe,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTextBlock } from "@/hooks/useTextBlock";
import Footer from "@/components/Footer";
import { apiService, TeamMember } from "@/services/api";
import HomepageCarousel from "@/components/HomepageCarousel";


export default function Index() {
  const [hero1, setHero1] = useState<string | null>(null);
  const [hero2, setHero2] = useState<string | null>(null);
  const [coreTeamMembers, setCoreTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    apiService.getImages().then(images => {
      const h1 = images.find(img => img.part === "Homepage Hero 1");
      const h2 = images.find(img => img.part === "Homepage Hero 2");
      setHero1(h1 ? (h1.url.startsWith("/uploads/") ? `${import.meta.env.VITE_API_URL}${h1.url}` : h1.url) : null);
      setHero2(h2 ? (h2.url.startsWith("/uploads/") ? `${import.meta.env.VITE_API_URL}${h2.url}` : h2.url) : null);
    });
  }, []);

  useEffect(() => {
    apiService.getPublicTeamMembers().then((members) => {
      const core = members.filter(m => m.core === true);
      setCoreTeamMembers(core);
    });
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { number: "10,000+", label: "Active Students", icon: Users },
    { number: "50+", label: "Annual Events", icon: Calendar },
    { number: "14+", label: "Distinguished Advisors", icon: Star },
    { number: "6+", label: "Partner Institutions", icon: Award },
  ];

  
  const siteTitle = useTextBlock("Site Title");
  const siteTagline = useTextBlock("Site Tagline");
  const homepageHeading = useTextBlock("Homepage Heading");
  const homepageSubheading = useTextBlock("Homepage Subheading");
  const aboutSectionTitle = useTextBlock("About Section Title");
  const aboutSectionBadge = useTextBlock("About Section Badge");
  const exploreSectionTitle = useTextBlock("Explore Section Title");
  const exploreSectionSubheading = useTextBlock("Explore Section Subheading");
  const quickLink1 = useTextBlock("Quick Link 1");
  const quickLink2 = useTextBlock("Quick Link 2");
  const quickLink3 = useTextBlock("Quick Link 3");
  const quickLink4 = useTextBlock("Quick Link 4");
  const quickLink4Desc = useTextBlock("Quick Link 4 Desc");
  const eventsSectionTitle = useTextBlock("Events Section Title");
  const eventsSectionSubheading = useTextBlock("Events Section Subheading");
  const leadersSectionTitle = useTextBlock("Leaders Section Title");
  const leadersSectionSubheading = useTextBlock("Leaders Section Subheading");
  const connectSectionTitle = useTextBlock("Connect Section Title");
  const connectSectionSubheading = useTextBlock("Connect Section Subheading");
  const whatWeDoTitle = useTextBlock("What We Do Title");
  const whatWeDo1 = useTextBlock("What We Do 1");
  const whatWeDo2 = useTextBlock("What We Do 2");
  const whatWeDo3 = useTextBlock("What We Do 3");
  const whatWeDo4 = useTextBlock("What We Do 4");//
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
  const teamSectionTitle = useTextBlock("Team Section Title");
  const teamSectionSubheading = useTextBlock("Team Section Subheading");
  const coreTeamTitle = useTextBlock("Core Team Title");
  const coreTeamSubheading = useTextBlock("Core Team Subheading");
  const advisorsSectionTitle = useTextBlock("Advisors Section Title");
  const advisorsSectionSubheading = useTextBlock("Advisors Section Subheading");
  const connectWithTeamTitle = useTextBlock("Connect With Team Title");
  const connectWithTeamSubheading = useTextBlock("Connect With Team Subheading");
  const joinTeamButton = useTextBlock("Join Team Button");
  const contactTeamButton = useTextBlock("Contact Team Button");

  const quickLinks = [
    {
      title: quickLink1 || "Our Events",
      path: "/events",
      description: eventsSectionTitle || "Upcoming Speaker Sessions and workshops",
      icon: Calendar,
      gradient: "from-primary/20 to-accent/20",
    },
    {
      title: quickLink2 || "Meet Our Team",
      path: "/team",
      description: teamSectionTitle || "Core team and board of advisors",
      icon: Users,
      gradient: "from-blue-500/20 to-purple-500/20",
    },
    {
      title: quickLink3 || "Join TPC",
      path: "/contact",
      description: joinTeamButton || "Become part of our Community",
      icon: Heart,
      gradient: "from-red-500/20 to-pink-500/20",
    },
    {
      title: quickLink4 || "Gallery",
      path: "/gallery",
      description: quickLink4Desc || "Moments from our events",
      icon: Sparkles,
      gradient: "from-green-500/20 to-teal-500/20",
    },
  ];

  const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);

  useEffect(() => {
    apiService.getLatestCompletedEvents().then(setFeaturedEvents).catch(() => setFeaturedEvents([]));
  }, []);

  const coreTeam = [
    {
      name: "Aditya Bhatt",
      position: "President & Founder",
      phone: "+91 97255 67871",
      image: "/images/hero.jpg",
    },
    {
      name: "Kavya Chokshi",
      position: "Vice President",
      phone: "+91 88665 88491",
      image: "/images/hero.jpg",
    },
    {
      name: "Dev Babani",
      position: "Secretary General",
      phone: "+91 9737224255",
      image: "/images/hero.jpg",
    },
  ];

  // Dynamic text blocks for all homepage text
  const aboutTPCDescription = useTextBlock("About TPC Description");
  const joinCommunityButton = useTextBlock("Join Our Community Button") || "Join Our Community";
  const exploreEventsButton = useTextBlock("Explore Events Button") || "Explore Events";
  const ourSupportersButton = useTextBlock("Our Supporters Button") || "Our Supporters";
  const floatingStat1Number = useTextBlock("Homepage Stat 1 Number") || "10K+";
  const floatingStat1Label = useTextBlock("Homepage Stat 1 Label") || "Students";
  const floatingStat2Number = useTextBlock("Homepage Stat 2 Number") || "50+";
  const floatingStat2Label = useTextBlock("Homepage Stat 2 Label") || "Events";
  const stat1Number = useTextBlock("Footer Stat 1 Number") || "10,000+";
  const stat1Label = useTextBlock("Footer Stat 1 Label") || "Active Students";
  const stat2Number = useTextBlock("Footer Stat 2 Number") || "50+";
  const stat2Label = useTextBlock("Footer Stat 2 Label") || "Annual Events";
  const stat3Number = useTextBlock("Footer Stat 3 Number") || "14+";
  const stat3Label = useTextBlock("Footer Stat 3 Label") || "Distinguished Advisors";
  const stat4Number = useTextBlock("Footer Stat 4 Number") || "6+";
  const stat4Label = useTextBlock("Footer Stat 4 Label") || "Partner Institutions";
  const achievement1Title = useTextBlock("Achievement 1 Title") || "Gujarat's Largest";
  const achievement1Subtitle = useTextBlock("Achievement 1 Subtitle") || "Student-Run Society";
  const achievement2Title = useTextBlock("Achievement 2 Title") || "10+ Years";
  const achievement2Subtitle = useTextBlock("Achievement 2 Subtitle") || "of Excellence";
  const achievement3Title = useTextBlock("Achievement 3 Title") || "Recognized by";
  const achievement3Subtitle = useTextBlock("Achievement 3 Subtitle") || "Top Institutions";
  const achievements = [
    {
      title: achievement1Title,
      subtitle: achievement1Subtitle,
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: achievement2Title,
      subtitle: achievement2Subtitle,
      icon: Award,
      color: "text-primary",
    },
    {
      title: achievement3Title,
      subtitle: achievement3Subtitle,
      icon: Globe,
      color: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section with Curved Design */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">


        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-40 right-32 w-24 h-24 bg-accent rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary/30 rounded-full blur-xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 ${isVisible ? "animate-slide-up" : ""}`}>
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="text-sm font-medium px-6 py-3 bg-primary/10 border-primary/20 animate-fade-in"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {siteTagline || "Gujarat's Largest Student-Run Society"}
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight text-foreground">
                  {siteTitle || "Turning Point Community"}
                  <span className="block text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  </span>
                </h1>

                <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                  {homepageSubheading || "Empowering over 10,000 students across Gujarat through intellectually enriching platforms that foster leadership, critical thinking, and civic engagement."}
                </p>
              </div>

              {/* Achievement Badges - always horizontal row, compact and smaller on mobile */}
              <div className="flex flex-row gap-2 sm:gap-4 justify-center">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-white/80 backdrop-blur rounded-xl px-2 py-2 sm:px-4 sm:py-3 shadow-lg animate-fade-in w-24 h-20 sm:w-48 sm:h-auto"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <achievement.icon
                      className={`h-5 w-5 sm:h-6 sm:w-6 ${achievement.color}`}
                    />
                    <div className="text-center">
                      <div className="font-bold text-xs sm:text-base">
                        {achievement.title}
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        {achievement.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action Buttons - Responsive layout for mobile/desktop */}
              {/* Desktop: row layout */}
              <div className="hidden sm:flex flex-row gap-4 pt-6">
                <Link to="/contact">
                  <Button
                    className="text-lg px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg"
                  >
                    {joinCommunityButton}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/events">
                  <Button
                    variant="outline"
                    className="text-lg px-8 border-2 hover:bg-primary/5"
                  >
                    {exploreEventsButton}
                  </Button>
                </Link>
                <Link to="/board-of-advisors">
                  <Button
                    variant="outline"
                    className="text-lg px-8 border-2 hover:bg-primary/5"
                  >
                    {ourSupportersButton}
                  </Button>
                </Link>
              </div>
              {/* Mobile: Join button full width, then two buttons in a row */}
              <div className="flex flex-col gap-2 pt-6 sm:hidden">
                <Link to="/contact">
                  <Button className="w-full text-base h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg">
                    {joinCommunityButton}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex flex-row gap-2">
                  <Link to="/events" className="flex-1">
                    <Button variant="outline" className="w-full text-base h-10 border-2 hover:bg-primary/5">
                      {exploreEventsButton}
                    </Button>
                  </Link>
                  <Link to="/board-of-advisors" className="flex-1">
                    <Button variant="outline" className="w-full text-base h-10 border-2 hover:bg-primary/5">
                      {ourSupportersButton}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl blob-shape animate-float">
                  {hero1 && (
                    <img
                      src={hero1}
                      alt="Students actively participating in a university lecture"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Floating Stats Cards */}
                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-lg animate-float">
                  <div className="text-2xl font-bold text-primary">{floatingStat1Number}</div>
                  <div className="text-sm text-muted-foreground">{floatingStat1Label}</div>
                </div>

                <div
                  className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg animate-float"
                  style={{ animationDelay: "3s" }}
                >
                  <div className="text-2xl font-bold text-accent">{floatingStat2Number}</div>
                  <div className="text-sm text-muted-foreground">{floatingStat2Label}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Curves */}
      <section className="py-6 bg-gradient-to-r from-primary to-accent text-primary-foreground relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-8 mt-2">
            {[
              { number: stat1Number, label: stat1Label, icon: Users },
              { number: stat2Number, label: stat2Label, icon: Calendar },
              { number: stat3Number, label: stat3Label, icon: Star },
              { number: stat4Number, label: stat4Label, icon: Award },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/10 sm:bg-transparent">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center mb-2">
                  <stat.icon className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-base text-white/80 text-center">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Carousel */}
      <section className="py-8 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-stretch">

            {/* Carousel Section */}
            <div className="relative">
              <div className="relative w-full lg:max-h-[500px] overflow-hidden rounded-2xl">
                <HomepageCarousel
                  className="w-full h-auto object-cover"
                  autoplayDelay={3000}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none"></div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="border-primary text-primary">
                  {aboutSectionBadge || "About TPC"}
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-4">
                  {aboutSectionTitle || "Shaping Tomorrow's Leaders"}
                </h2>
              </div>

              <div className="space-y-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                {aboutTPCDescription ? (
                  aboutTPCDescription.split('\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>About TPC description coming soon.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links with Carousel */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h2 className="text-[6vw] sm:text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap leading-tight tracking-tight">
              {exploreSectionTitle || "Explore TPC"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {exploreSectionSubheading || "Discover different aspects of our vibrant Community"}
            </p>
          </div>
          {/* Desktop and tablet: 4 in a row */}
          <div className="hidden sm:grid grid-cols-4 gap-6 mt-8">
            {quickLinks.map((link) => (
              <Link key={link.title} to={link.path} className="group flex-1 min-w-[220px] max-w-xs mx-auto">
                <Card
                  className={`w-80 h-80 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-80 lg:h-80 flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${link.gradient} border-0 overflow-hidden`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/80 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                      <link.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center mt-auto pb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-white/5"
                    >
                      Explore
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {/* Mobile: 2x2 grid, 2 cards per row */}
          <div className="grid grid-cols-2 gap-4 mt-8 sm:hidden">
            {quickLinks.slice(0, 2).map((link) => (
              <Link key={link.title} to={link.path} className="group flex-1 min-w-[140px] max-w-xs mx-auto">
                <Card
                  className={`w-40 h-40 flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${link.gradient} border-0 overflow-hidden`}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white/80 rounded-full mb-2 group-hover:scale-110 transition-transform duration-300">
                      <link.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center mt-auto pb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-white/5 px-2 py-1 text-xs"
                    >
                      Explore
                      <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 sm:hidden">
            {quickLinks.slice(2, 4).map((link) => (
              <Link key={link.title} to={link.path} className="group flex-1 min-w-[140px] max-w-xs mx-auto">
                <Card
                  className={`w-40 h-40 flex flex-col justify-between hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br ${link.gradient} border-0 overflow-hidden`}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white/80 rounded-full mb-2 group-hover:scale-110 transition-transform duration-300">
                      <link.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {link.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {link.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center mt-auto pb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-white/5 px-2 py-1 text-xs"
                    >
                      Explore
                      <ChevronRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events with Images */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="outline"
              className="border-primary text-primary mb-4"
            >
              Upcoming Events
            </Badge>
            <h2 className="text-[6vw] sm:text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap leading-tight tracking-tight">
              {eventsSectionTitle || "Events we have done"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {eventsSectionSubheading || "Be part of Gujarat's most prestigious academic competitions"}
            </p>
          </div>

          {featuredEvents.length === 0 && (
            <div className="text-center text-muted-foreground text-lg mb-8">
              No completed events to display yet.
            </div>
          )}
          {featuredEvents.length > 0 && featuredEvents.length < 3 && (
            <div className="text-center text-muted-foreground text-lg mb-8">
              Showing only {featuredEvents.length} completed event{featuredEvents.length > 1 ? 's' : ''}.
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 group"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={event.image ? (event.image.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${event.image}` : event.image) : '/images/hero.jpg'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {event.category && (
                    <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                      {event.category}
                    </Badge>
                  )}
                  {event.status === 'Completed' && (
                    <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                      Completed
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {event.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  
                 
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="text-center mt-16">
          <Link to="/events">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent shadow-lg"
            >
              Explore Upcoming Events
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Core Team Section on Homepage */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary font-semibold mb-4">Core Team</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2">{leadersSectionTitle}</h2>
            <p className="text-lg text-muted-foreground">{leadersSectionSubheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreTeamMembers.map(member => (
              <Card key={member._id} className="flex flex-row items-center p-8 rounded-2xl shadow-lg">
                {/* Avatar/Image */}
                <div className="flex-shrink-0 w-28 h-28 rounded-full overflow-hidden mr-6">
                  {member.image ? (
                    <img src={member.image.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${member.image}` : member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <div className="text-primary font-semibold text-lg mb-1">{member.position}</div>
                  {member.city && (
                    <div className="text-muted-foreground text-base mb-1">{member.city}</div>
                  )}
                  {member.core && (
                    <div className="inline-block px-3 py-1 rounded-md bg-yellow-200 text-yellow-900 font-semibold text-base mb-1">Core Member</div>
                  )}
                  {member.description && (
                    <div className="text-muted-foreground text-base mt-1">{member.description}</div>
                  )}
                  {member.phone && (
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Phone className="w-5 h-5 mr-2" />
                      {member.phone}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-16">
            <Link to="/team">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent shadow-lg">
                View All Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                {connectSectionTitle}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
{connectSectionSubheading}
              </p>
            </div>

            {/* Responsive horizontal scroll row for social cards - small on mobile, big on laptop */}
            <div className="flex flex-row gap-2 max-w-full overflow-x-auto justify-center items-stretch py-2">
              {/* Instagram Card */}
              <a href="https://instagram.com/turningpoint_Community" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl px-2 py-3 sm:px-8 sm:py-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between min-w-[110px] max-w-[130px] sm:min-w-[180px] sm:max-w-[220px] flex-shrink-0">
                <div className="w-8 h-8 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-2 sm:mb-6">
                  <Instagram className="h-4 w-4 sm:h-10 sm:w-10 text-white" />
                </div>
                <h3 className="font-semibold text-xs sm:text-lg mb-1 sm:mb-2">Instagram</h3>
                <p className="text-[10px] sm:text-sm text-muted-foreground text-center leading-tight">
                  Daily updates & behind-the-scenes
                </p>
                <div className="mt-1 sm:mt-2 text-primary font-medium text-[7px] sm:text-sm">
                  @turningpoint_Community
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href="https://www.linkedin.com/in/turning-point-community-493217365/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl px-2 py-3 sm:px-8 sm:py-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between min-w-[110px] max-w-[130px] sm:min-w-[180px] sm:max-w-[220px] flex-shrink-0 outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Visit our LinkedIn page"
              >
                <div className="w-8 h-8 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-2 sm:mb-6">
                  <Linkedin className="h-4 w-4 sm:h-10 sm:w-10 text-white" />
                </div>
                <h3 className="font-semibold text-xs sm:text-lg mb-1 sm:mb-2">LinkedIn</h3>
                <p className="text-[10px] sm:text-sm text-muted-foreground text-center leading-tight">
                  Professional network & opportunities
                </p>
                <div className="mt-1 sm:mt-3 text-primary font-medium text-[10px] sm:text-sm">
                  Follow Us
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
}
