
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Shield, 
  HelpCircle, 
  MessageSquare,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  TrendingUp
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Help Center", href: "/help" }
  ];

  const communityLinks = [
    { label: "Forums", href: "/news" },
    { label: "Discovery Calls", href: "/events" },
    { label: "Success Stories", href: "/news" },
    { label: "Report Scam", href: "/contact", icon: Shield }
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16">
      <div className="container mx-auto max-w-6xl py-12 px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">
                SmartClicks
              </h3>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              The world's most trusted platform for social media earners. 
              Complete tasks, connect with professionals, and build lasting success.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">Stay Updated</h4>
              <div className="flex gap-2 max-w-sm">
                <Input 
                  placeholder="Enter your email"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
                <Button size="sm" className="shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                Get the latest opportunities and success stories
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.href)}
                    className="text-slate-300 hover:text-white transition-colors duration-200 text-sm flex items-center gap-2"
                  >
                    {link.icon && <link.icon className="w-3 h-3" />}
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-300">
                © 2024 SmartClicks. All rights reserved.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Independent social media earning platform.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all duration-200"
                >
                  <social.icon className="w-4 h-4 text-slate-300" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
