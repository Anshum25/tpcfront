import React from "react";
import { Card } from "@/components/ui/card";
import { Advisor } from "@/services/api";

interface AdvisorSectionProps {
  title: string;
  subtitle: string;
  advisors: Advisor[];
  loading: boolean;
  error: string | null;
}

const AdvisorSection = React.memo(({ 
  title, 
  subtitle, 
  advisors, 
  loading, 
  error 
}: AdvisorSectionProps) => {
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Don't render section if no advisors and not loading
  if (!loading && (!advisors || advisors.length === 0)) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading {title.toLowerCase()}...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 overflow-x-hidden">
            {advisors.map((advisor) => (
              <Card
                key={advisor._id}
                className="flex flex-col md:flex-row items-center hover:shadow-2xl transition-all duration-300 p-3 md:p-8 rounded-2xl text-sm md:text-lg w-full h-auto md:w-[420px] md:h-[200px] mx-auto min-h-[140px] md:min-h-[180px] min-w-[120px] md:min-w-[220px] gap-3 md:gap-6"
              >
                <div className="flex items-center justify-center mb-2 md:mb-0">
                  <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden aspect-square">
                    {advisor.image ? (
                      <img
                        src={advisor.image.startsWith('/uploads/') ? BACKEND_URL + advisor.image : advisor.image}
                        alt={advisor.name}
                        className="w-full h-full object-cover rounded-full aspect-square"
                        style={{ aspectRatio: '1 / 1' }}
                      />
                    ) : (
                      <span className="text-base md:text-2xl font-bold text-primary">
                        {advisor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center h-full md:pl-6 text-center md:text-left w-full">
                  <span className="text-xs md:text-xl font-bold mb-1">{advisor.name}</span>
                  <span className="text-primary font-semibold text-xs md:text-base mb-1">{advisor.title}</span>
                  <span className="text-xs md:text-base text-muted-foreground mb-1">{advisor.organization}</span>
                  {advisor.description && (
                    <span className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-2">{advisor.description}</span>
                  )}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 mt-2">
                    {(advisor.expertise || []).map((skill, index) => (
                      <span key={index} className="bg-primary/10 text-primary font-semibold px-2 md:px-3 py-0.5 rounded-full text-[10px] md:text-xs uppercase tracking-wide">{skill}</span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

AdvisorSection.displayName = 'AdvisorSection';

export default AdvisorSection;