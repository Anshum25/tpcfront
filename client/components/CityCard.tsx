import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CityData } from "@/services/api";

interface CityCardProps {
  city: CityData;
  onRegisterClick: (city: CityData) => void;
}

const CityCard = memo(({ city, onRegisterClick }: CityCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* City Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            // Fallback image if city image fails to load
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/400/300';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-bold text-white">{city.name}</h3>
        </div>
      </div>
      
      {/* City Info */}
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{city.studentCount}+</div>
            <div className="text-sm text-muted-foreground">Students Joined</div>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => onRegisterClick(city)}
        >
          Register Now
        </Button>
      </CardContent>
    </Card>
  );
});

CityCard.displayName = 'CityCard';

export default CityCard;