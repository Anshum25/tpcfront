import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroButtonsProps {
  joinCommunityButton: string;
  exploreEventsButton: string;
  ourSupportersButton: string;
  layout: 'desktop' | 'mobile';
}

export default function HeroButtons({
  joinCommunityButton,
  exploreEventsButton,
  ourSupportersButton,
  layout
}: HeroButtonsProps) {
  if (layout === 'desktop') {
    return (
      <div className="hidden sm:flex flex-row gap-4 pt-6">
        <a href="https://whatsapp.com/channel/0029Vb5xpVmIN9ixjY1Tcm0h" target="_blank" rel="noopener noreferrer">
          <Button
            className="text-lg px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg"
          >
            {joinCommunityButton}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </a>
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
    );
  }

  // Mobile layout
  return (
    <div className="flex flex-col gap-2 pt-6 sm:hidden">
      <a href="https://whatsapp.com/channel/0029Vb5xpVmIN9ixjY1Tcm0h" target="_blank" rel="noopener noreferrer">
        <Button className="w-full text-base h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg">
          {joinCommunityButton}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </a>
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
  );
}