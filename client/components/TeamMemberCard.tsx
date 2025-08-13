import React, { memo } from "react";
import { Card } from "@/components/ui/card";
import { TeamMember } from "@/services/api";

interface TeamMemberCardProps {
  member: TeamMember;
  backendUrl: string;
}

const TeamMemberCard = memo(({ member, backendUrl }: TeamMemberCardProps) => {
  return (
    <Card className="flex flex-row items-center hover:shadow-xl transition-all duration-300 p-2 md:p-4 rounded-xl text-xs md:text-sm w-full h-[120px] md:w-[280px] md:h-[120px] mx-auto min-h-[100px] min-w-[140px] gap-3">
      {/* Avatar/Image */}
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center bg-primary/10">
        {member.image ? (
          <img
            src={member.image.startsWith('/uploads/') ? backendUrl + member.image : member.image}
            alt={member.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Hide image and show initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-base md:text-lg font-bold text-primary">${member.name.split(' ').map(n => n[0]).join('')}</span>`;
              }
            }}
          />
        ) : (
          <span className="text-base md:text-lg font-bold text-primary">
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        )}
      </div>
      
      {/* Info */}
      <div className="flex flex-col justify-center h-full pl-3 md:pl-4 text-left">
        <span className="text-sm md:text-base font-bold mb-1">{member.name}</span>
        <span className="text-primary font-semibold text-xs md:text-sm mb-1">{member.position}</span>
        {member.city && (
          <span className="text-muted-foreground text-xs mb-1">{member.city}</span>
        )}
        {member.description && (
          <span className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {member.description}
          </span>
        )}
      </div>
    </Card>
  );
});

TeamMemberCard.displayName = 'TeamMemberCard';

export default TeamMemberCard;