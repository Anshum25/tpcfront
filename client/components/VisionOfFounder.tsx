import { Badge } from "@/components/ui/badge";
import { Target, BookOpen, Users, Globe } from "lucide-react";

export default function VisionOfFounder() {
  return (
    <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-3 mb-8">
          <Badge
            variant="outline"
            className="border-primary text-primary mb-4"
          >
            Leadership Vision
          </Badge>
          <h2 className="text-[5vw] sm:text-2xl md:text-3xl lg:text-4xl font-bold whitespace-nowrap leading-tight tracking-tight">
            Vision of the Founder
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Inspiring leadership that shapes the future of student communities
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Content - Description and Name */}
          <div className="space-y-4 order-2 lg:order-1">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                Aditya Bhatt
              </h3>
              <p className="text-lg text-primary font-semibold">
                Founder
              </p>
            </div>
            
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p className="text-sm sm:text-base">
                "In a country as diverse as ours, opinions are infinite — but expression isn't always equal. This society was born from a dream to change that. A dream to create a space where every young mind could speak, question, and lead with courage."
              </p>
              <p className="text-sm sm:text-base">
                "Our mission is to make public speaking not a privilege, but a culture — to empower every student, every individual, to express, question, and shape the narrative of tomorrow's India."
              </p>
              <p className="text-sm sm:text-base">
                "Debating, to us, isn't just an event. It's a mindset, one that teaches clarity over chaos, conviction over noise, and respect over rage."
              </p>
              <p className="text-sm sm:text-base font-medium">
                "As we continue to grow, my vision remains rooted in the same belief that started it all: That one voice, when brave enough to stand, can inspire a thousand more to rise."
              </p>
            </div>
            
            {/* Key Vision Points */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-6">
              <div className="flex items-center bg-white/80 backdrop-blur rounded-xl px-3 py-2 shadow-lg">
                <Target className="h-4 w-4 text-primary mr-2" />
                <span className="font-semibold text-xs sm:text-sm">Expression</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur rounded-xl px-3 py-2 shadow-lg">
                <BookOpen className="h-4 w-4 text-accent mr-2" />
                <span className="font-semibold text-xs sm:text-sm">Public Speaking</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur rounded-xl px-3 py-2 shadow-lg">
                <Users className="h-4 w-4 text-primary mr-2" />
                <span className="font-semibold text-xs sm:text-sm">Debating</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur rounded-xl px-3 py-2 shadow-lg">
                <Globe className="h-4 w-4 text-accent mr-2" />
                <span className="font-semibold text-xs sm:text-sm">Leadership</span>
              </div>
            </div>
          </div>
          
          {/* Right Side - Photo */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-2xl ring-4 ring-primary/20">
                <img
                  src="/images/founder.jpg"
                  alt="Aditya Bhatt - Founder of Turning Point Community"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to a gradient background if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <div class="text-white text-6xl font-bold">AB</div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}