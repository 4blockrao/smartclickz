import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useModernAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SeoMeta from "@/components/SeoMeta";
import { 
  Users, 
  CheckCircle, 
  TrendingUp,
  Globe,
  Play,
  Trophy,
  Sparkles,
  ArrowRight,
  Star,
  Shield,
  Zap,
  DollarSign,
  Target,
  Rocket,
  Award,
  BarChart3,
  Clock
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartEarning = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const stats = [
    { 
      label: "Active Users", 
      value: "2.5M+", 
      icon: Users,
      color: "from-purple-400 to-pink-400"
    },
    { 
      label: "Tasks Completed", 
      value: "150M+", 
      icon: CheckCircle,
      color: "from-blue-400 to-cyan-400"
    },
    { 
      label: "Paid Out", 
      value: "$50M+", 
      icon: DollarSign,
      color: "from-green-400 to-emerald-400"
    },
    { 
      label: "Countries", 
      value: "150+", 
      icon: Globe,
      color: "from-orange-400 to-red-400"
    }
  ];

  const features = [
    {
      icon: Rocket,
      title: "Instant Setup",
      description: "Get started in under 2 minutes. No lengthy verifications.",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Shield,
      title: "Verified & Secure",
      description: "All tasks verified. Payments guaranteed. Your data protected.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Real-Time Payments",
      description: "Get paid instantly upon task completion. No waiting periods.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your earnings, progress, and optimize your strategy.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Target,
      title: "Smart Matching",
      description: "AI-powered task matching based on your skills and interests.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Award,
      title: "Rewards & Levels",
      description: "Unlock better tasks and bonuses as you level up.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const taskTypes = [
    {
      title: "Social Media Engagement",
      description: "Like, share, follow, and engage with social media content",
      reward: "$0.10 - $5.00",
      tasks: "5.2K+ available",
      icon: "📱",
      color: "from-blue-500/10 to-cyan-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Content Creation",
      description: "Write reviews, create posts, and produce engaging content",
      reward: "$5.00 - $50.00",
      tasks: "2.1K+ available",
      icon: "✍️",
      color: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20"
    },
    {
      title: "App Testing & Reviews",
      description: "Test mobile apps, websites, and leave detailed feedback",
      reward: "$2.00 - $25.00",
      tasks: "3.8K+ available",
      icon: "📱",
      color: "from-green-500/10 to-emerald-500/10",
      border: "border-green-500/20"
    },
    {
      title: "Surveys & Research",
      description: "Share opinions, participate in market research studies",
      reward: "$1.00 - $20.00",
      tasks: "4.5K+ available",
      icon: "📊",
      color: "from-orange-500/10 to-red-500/10",
      border: "border-orange-500/20"
    }
  ];

  return (
    <>
      <SeoMeta 
        title="SmartClicks - Earn Money Through Social Media"
        description="Join the world's largest social earning platform. Complete tasks, earn rewards, and get paid instantly. Start earning today!"
        keywords={["social media tasks", "earn money online", "micro tasks", "social marketing", "remote work"]}
      />
      
      {/* Modern Navigation */}
      <motion.header 
        className="nav-modern safe-top"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container-modern py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">SmartClicks</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <button className="nav-link">Features</button>
              <button className="nav-link">How it Works</button>
              <button 
                onClick={() => navigate("/leaderboard")}
                className="nav-link"
              >
                Leaderboard
              </button>
              <button className="nav-link">Support</button>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="glass-card px-4 py-2">
                    <span className="text-sm text-muted-foreground">Balance:</span>
                    <span className="text-sm font-semibold text-foreground ml-2">$0.00</span>
                  </div>
                  <div className="w-10 h-10 gradient-primary rounded-xl shadow-lg"></div>
                </div>
              ) : (
                <Button 
                  onClick={() => navigate("/auth")}
                  className="btn-secondary"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden bg-background bg-mesh pt-24">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-grid">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-accent-secondary/5 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 container-modern section-modern">
          <div className="max-w-6xl mx-auto text-center space-y-modern">
            {/* Status Badge */}
            <motion.div 
              className="inline-flex items-center gap-3 glass-card px-6 py-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="status-online"></div>
              <span className="text-foreground font-medium">2.5M+ users earning daily</span>
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            
            {/* Main Headline */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-balance">
                <span className="text-foreground">Earn Money Through</span>
                <br />
                <span className="gradient-text">Social Media</span>
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto text-balance">
                Complete verified tasks, engage with content, and get paid instantly. 
                Join the future of social earning.
              </p>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                onClick={handleStartEarning}
                className="btn-primary text-lg px-8 py-4"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Earning Now
              </Button>
              <Button 
                onClick={() => navigate("/leaderboard")}
                className="btn-secondary text-lg px-8 py-4"
                variant="outline"
                size="lg"
              >
                <Trophy className="w-5 h-5 mr-2" />
                View Leaderboard
              </Button>
            </motion.div>
            
            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="dashboard-stat group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:animate-glow`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="dashboard-stat-value">{stat.value}</div>
                  <div className="dashboard-stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-8 pt-12 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-success" />
                <span className="font-medium">Verified & Secure</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-5 h-5 text-warning" />
                <span className="font-medium">Instant Payments</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="w-5 h-5 text-primary" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-modern bg-background-secondary relative">
        <div className="container-modern">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6">Why Choose SmartClicks?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for creators, by creators. Experience the most advanced social earning platform.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="dashboard-card group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:animate-glow`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Task Types Section */}
      <section className="section-modern">
        <div className="container-modern">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-6">Choose Your Earning Method</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple ways to earn money that fit your skills and schedule.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {taskTypes.map((task, index) => (
              <motion.div
                key={index}
                className={`glass-card-hover p-6 ${task.border} border-2`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{task.icon}</div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">{task.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{task.description}</p>
                  
                  <div className="space-y-3">
                    <div className="status-success">
                      {task.reward}
                    </div>
                    <p className="text-xs text-muted-foreground">{task.tasks}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-modern gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container-modern text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-white mb-6">Ready to Start Earning?</h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
              Join millions of users worldwide who are already earning money through social media.
              It's free to start and you can begin earning immediately.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={handleStartEarning}
                className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 border-0 shadow-2xl"
              >
                {user ? "Go to Dashboard" : "Join SmartClicks"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Instant payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Mobile app</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;