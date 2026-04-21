
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Users, 
  Building2, 
  MessageSquare, 
  Megaphone, 
  Calendar,
  Star,
  PlusCircle,
  TrendingUp,
  Award
} from "lucide-react";

const quickLinks = [
  {
    title: "Discover Opportunities",
    description: "Explore verified MLM companies and opportunities",
    icon: Search,
    href: "/companies",
    gradient: "from-primary/10 to-primary/5",
    iconColor: "text-primary"
  },
  {
    title: "Top Networkers",
    description: "Connect with successful network marketers",
    icon: Users,
    href: "/profiles",
    gradient: "from-accent-green/10 to-accent-green/5",
    iconColor: "text-accent-green"
  },
  {
    title: "Company Reviews",
    description: "Read authentic reviews and success stories",
    icon: Star,
    href: "/companies",
    gradient: "from-accent-gold/10 to-accent-gold/5",
    iconColor: "text-accent-gold"
  },
  {
    title: "Classifieds",
    description: "Browse and post classified advertisements",
    icon: Megaphone,
    href: "/classifieds",
    gradient: "from-primary/10 to-primary/5",
    iconColor: "text-primary"
  },
  {
    title: "Discovery Calls",
    description: "Join live sessions with industry experts",
    icon: Calendar,
    href: "/events",
    gradient: "from-accent-green/10 to-accent-green/5",
    iconColor: "text-accent-green"
  },
  {
    title: "Community Hub",
    description: "Engage with fellow network marketers",
    icon: MessageSquare,
    href: "/news",
    gradient: "from-accent-gold/10 to-accent-gold/5",
    iconColor: "text-accent-gold"
  }
];

export default function QuickLinks() {
  const navigate = useNavigate();

  return (
    <section className="section-spacing bg-muted/30">
      <div className="container-modern max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-section font-bold text-foreground mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access powerful tools and resources designed for network marketing professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickLinks.map((link, index) => (
            <Card 
              key={link.title}
              variant="interactive"
              className="group cursor-pointer h-full"
              onClick={() => navigate(link.href)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <link.icon className={`w-6 h-6 ${link.iconColor}`} />
                </div>
                
                <h3 className="text-card-title font-semibold text-foreground mb-2">
                  {link.title}
                </h3>
                
                <p className="text-caption text-muted-foreground leading-relaxed">
                  {link.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Featured Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
            onClick={() => navigate("/submit-classified-ad")}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Post Your Ad
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-accent-green text-accent-green hover:bg-accent-green/5"
            onClick={() => navigate("/submit-news")}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Share Your Success
          </Button>
        </div>
      </div>
    </section>
  );
}
