import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Star, 
  Briefcase, 
  Users, 
  Building, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile, useIsTablet } from '@/hooks/useResponsive';
import { motion } from 'framer-motion';

/**
 * Modern homepage section with mobile-first design
 * Showcases main features with visual hierarchy and compelling content
 */
export default function ModernHomeSection() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-32">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background -z-10" />
      
      {/* Hero Section */}
      <div className="container px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge 
            variant="outline" 
            className="mb-4 px-3 py-1 text-sm bg-background/80 backdrop-blur-sm border-primary/20 text-primary font-medium"
          >
            Networker Insights Hub
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Connect, Grow, and <span className="text-primary">Thrive</span> in Your Network
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The all-in-one platform for networkers to build meaningful connections, discover opportunities, and accelerate professional growth.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base px-8 py-6 rounded-xl bg-primary hover:bg-primary/90"
              onClick={() => navigate('/auth')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-base px-8 py-6 rounded-xl border-primary/20 text-primary hover:bg-primary/5"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
        
        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Card 1 */}
          <motion.div variants={item}>
            <Card className="border border-border/60 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden group rounded-2xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect with Peers</h3>
                <p className="text-muted-foreground mb-4">Build your professional network with like-minded individuals and industry leaders.</p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary font-medium hover:bg-transparent hover:text-primary/80 group-hover:underline"
                  onClick={() => navigate('/profiles')}
                >
                  Explore Network
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Card 2 */}
          <motion.div variants={item}>
            <Card className="border border-border/60 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden group rounded-2xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover Opportunities</h3>
                <p className="text-muted-foreground mb-4">Browse exclusive classifieds and opportunities posted by community members.</p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary font-medium hover:bg-transparent hover:text-primary/80 group-hover:underline"
                  onClick={() => navigate('/classifieds')}
                >
                  View Classifieds
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Card 3 */}
          <motion.div variants={item}>
            <Card className="border border-border/60 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden group rounded-2xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Company Insights</h3>
                <p className="text-muted-foreground mb-4">Gain valuable insights into companies and explore partnerships and opportunities.</p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary font-medium hover:bg-transparent hover:text-primary/80 group-hover:underline"
                  onClick={() => navigate('/companies')}
                >
                  Explore Companies
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Card 4 */}
          <motion.div variants={item}>
            <Card className="border border-border/60 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden group rounded-2xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Tasks</h3>
                <p className="text-muted-foreground mb-4">Earn points and rewards by completing tasks and engaging with the community.</p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary font-medium hover:bg-transparent hover:text-primary/80 group-hover:underline"
                  onClick={() => navigate('/tasks')}
                >
                  View Tasks
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Card 5 */}
          <motion.div variants={item}>
            <Card className="border border-border/60 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden group rounded-2xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Engagement</h3>
                <p className="text-muted-foreground mb-4">Join discussions, share insights, and connect with other professionals in your field.</p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary font-medium hover:bg-transparent hover:text-primary/80 group-hover:underline"
                  onClick={() => navigate('/community')}
                >
                  Join Community
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Card 6 */}
          <motion.div variants={item}>
            <Card className="border border-border/60 bg-card/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden group rounded-2xl">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-muted-foreground mb-4">Monitor your growth, track your achievements, and celebrate your milestones.</p>
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary font-medium hover:bg-transparent hover:text-primary/80 group-hover:underline"
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Statistics Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-12">Trusted by professionals worldwide</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-primary mb-2">10k+</span>
              <span className="text-sm text-muted-foreground">Active Users</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</span>
              <span className="text-sm text-muted-foreground">Companies</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-primary mb-2">1.2M+</span>
              <span className="text-sm text-muted-foreground">Connections Made</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-primary mb-2">98%</span>
              <span className="text-sm text-muted-foreground">Satisfaction Rate</span>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-20">
          <Card className="border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-primary/5 rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to elevate your network?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our community of professionals and unlock a world of opportunities.
              </p>
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="px-8 py-6 rounded-xl bg-primary hover:bg-primary/90"
                onClick={() => navigate('/auth')}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}