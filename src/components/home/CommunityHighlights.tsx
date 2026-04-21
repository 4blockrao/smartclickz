
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

// Mock data for community highlights
const communityData = {
  stats: [
    { label: "Active Discussions", value: "1,247", icon: MessageSquare, color: "text-primary" },
    { label: "Members Online", value: "892", icon: Users, color: "text-accent-green" },
    { label: "Success Stories", value: "156", icon: TrendingUp, color: "text-accent-gold" }
  ],
  trendingTopics: [
    {
      title: "Best Practices for New Network Marketers",
      author: "Sarah Johnson",
      replies: 23,
      likes: 67,
      category: "Getting Started"
    },
    {
      title: "Company Spotlight: Success Stories from Top Performers",
      author: "Mike Chen",
      replies: 18,
      likes: 45,
      category: "Success Stories"
    },
    {
      title: "Building Your Personal Brand in Network Marketing",
      author: "Emma Davis",
      replies: 31,
      likes: 89,
      category: "Marketing Tips"
    }
  ]
};

export default function CommunityHighlights() {
  const navigate = useNavigate();

  return (
    <section className="section-spacing bg-muted/30">
      <div className="container-modern max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-section font-bold text-foreground mb-2">
              🧠 Community Highlights
            </h2>
            <p className="text-lg text-muted-foreground">
              Join the conversation with fellow network marketing professionals
            </p>
          </div>
          <Button 
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5 mt-4 md:mt-0"
            onClick={() => navigate("/news")}
          >
            Join Discussions
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {communityData.stats.map((stat, index) => (
            <Card key={stat.label} variant="highlight" className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-caption text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trending Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trending Discussions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {communityData.trendingTopics.map((topic, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl border border-border hover:bg-muted/50 cursor-pointer transition-colors duration-200 group"
                onClick={() => navigate("/news")}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {topic.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-1 ml-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-caption text-muted-foreground">
                      by {topic.author}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {topic.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-caption text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {topic.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {topic.replies}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
