
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Globe, Building2, TrendingUp } from "lucide-react";

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent-green/5 pt-16 pb-20 sm:pt-24 sm:pb-32">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-green/10 rounded-full blur-2xl opacity-60" />
      </div>
      
      <div className="container-modern relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-hero font-bold text-foreground mb-6 animate-fade-in">
            Explore. Connect. <span className="text-primary">Succeed.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            The world's most trusted platform for network marketers to discover opportunities, 
            connect with verified professionals, and build lasting success.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button 
              size="lg" 
              className="btn-primary shadow-button hover:shadow-button-hover"
              onClick={() => navigate("/companies")}
            >
              Find Opportunities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            {!user ? (
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
                onClick={() => navigate("/auth")}
              >
                Join the Network
                <Users className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5"
                onClick={() => navigate("/profiles")}
              >
                Discover Networkers
                <Users className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto text-center animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-lg font-semibold text-foreground">12,000+</div>
              <div className="text-sm text-muted-foreground">Networkers</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-accent-green" />
              </div>
              <div className="text-lg font-semibold text-foreground">78</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-lg font-semibold text-foreground">320+</div>
              <div className="text-sm text-muted-foreground">Verified Companies</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-accent-green" />
              </div>
              <div className="text-lg font-semibold text-foreground">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
