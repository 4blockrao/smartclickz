
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Shield, 
  Target, 
  Globe, 
  Award,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Trust & Verification",
      description: "All companies and networkers are verified through our comprehensive screening process."
    },
    {
      icon: Users,
      title: "Global Community",
      description: "Connect with over 12,000 network marketers across 78 countries worldwide."
    },
    {
      icon: Target,
      title: "Opportunity Discovery",
      description: "Find legitimate network marketing opportunities that match your goals and interests."
    },
    {
      icon: Globe,
      title: "Transparency First",
      description: "Access authentic reviews, success stories, and honest company assessments."
    }
  ];

  const stats = [
    { label: "Active Networkers", value: "12,000+" },
    { label: "Countries", value: "78" },
    { label: "Verified Companies", value: "320+" },
    { label: "Success Rate", value: "98%" }
  ];

  return (
    <Layout>
      <div className="w-full">
        {/* Hero Section */}
        <section className="section-spacing bg-gradient-to-br from-background via-primary/5 to-accent-green/5">
          <div className="container-modern max-w-4xl text-center">
            <Badge variant="outline" className="mb-6 px-4 py-2">
              About Networker Today
            </Badge>
            <h1 className="text-hero font-bold text-foreground mb-6">
              Building Trust in Network Marketing
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to create the world's most trusted platform for network marketing professionals. 
              Our community-driven approach ensures transparency, authenticity, and genuine opportunities for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-primary shadow-button hover:shadow-button-hover"
                onClick={() => navigate("/companies")}
              >
                Explore Opportunities
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/profiles")}
              >
                Meet Our Community
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-spacing">
          <div className="container-modern max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} variant="highlight" className="text-center">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-caption text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-spacing bg-muted/30">
          <div className="container-modern max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-section font-bold text-foreground mb-4">
                Why Choose Networker Today?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We've built our platform with the network marketing community in mind, 
                focusing on what matters most to professionals like you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} variant="interactive" className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-card-title font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-spacing">
          <div className="container-modern max-w-4xl">
            <Card variant="highlight">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  To create a transparent, trustworthy ecosystem where network marketing professionals 
                  can discover legitimate opportunities, connect with verified peers, and build 
                  sustainable businesses based on authentic relationships and proven success.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-caption">Transparency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-caption">Authenticity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-caption">Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-green" />
                    <span className="text-caption">Success</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="section-spacing bg-muted/30">
          <div className="container-modern max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-section font-bold text-foreground mb-4">
                Leadership
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the visionary behind Networker Today
              </p>
            </div>
            
            <Card variant="highlight">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-card-title font-bold text-foreground mb-2">
                    Manraj Singh BAINS
                  </h3>
                  <p className="text-body text-primary font-medium">
                    Founder & CEO
                  </p>
                </div>
                <p className="text-body text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
                  With a passion for building transparent and trustworthy ecosystems, 
                  Manraj Singh BAINS founded Networker Today to revolutionize the network 
                  marketing industry. His vision is to create a platform where professionals 
                  can connect, grow, and succeed with integrity and authenticity.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Company Information Section */}
        <section className="section-spacing">
          <div className="container-modern max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-section font-bold text-foreground mb-4">
                Company Information
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                About our organization
              </p>
            </div>
            
            <Card variant="highlight">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-card-title font-bold text-foreground mb-2">
                      SOCIAL TRADE INC LIMITED
                    </h3>
                    <Badge variant="outline" className="mb-4">
                      United Kingdom
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Company Type</h4>
                      <p className="text-body text-muted-foreground">Holding Company</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Jurisdiction</h4>
                      <p className="text-body text-muted-foreground">United Kingdom</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Platform</h4>
                      <p className="text-body text-muted-foreground">Networker Today</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Founded</h4>
                      <p className="text-body text-muted-foreground">2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
