
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle,
  Book,
  Users,
  Shield
} from "lucide-react";

export default function Help() {
  const faqCategories = [
    {
      icon: Users,
      title: "Getting Started",
      questions: [
        "How do I create my networker profile?",
        "How do I verify my account?",
        "How do I connect with other networkers?",
        "What information should I include in my profile?"
      ]
    },
    {
      icon: Shield,
      title: "Safety & Trust",
      questions: [
        "How do you verify companies and opportunities?",
        "How do I report suspicious activity?",
        "What makes a review trustworthy?",
        "How do I protect my personal information?"
      ]
    },
    {
      icon: Book,
      title: "Platform Features",
      questions: [
        "How do I post a classified ad?",
        "How do I search for opportunities?",
        "How do I join discovery calls?",
        "How do I participate in forums?"
      ]
    }
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: "24/7"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Send Email",
      available: "Response within 24hrs"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      action: "Call Now",
      available: "Mon-Fri 9AM-6PM EST"
    }
  ];

  return (
    <Layout>
      <div className="w-full">
        <section className="section-spacing">
          <div className="container-modern max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-hero font-bold text-foreground mb-4">
                Help Center
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Find answers to common questions or get in touch with our support team.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for help..."
                    className="pl-10 input-modern"
                  />
                </div>
              </div>
            </div>

            {/* FAQ Categories */}
            <div className="mb-16">
              <h2 className="text-section font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {faqCategories.map((category, index) => (
                  <Card key={index} variant="interactive" className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <category.icon className="w-5 h-5 text-primary" />
                        </div>
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.questions.map((question, qIndex) => (
                          <li key={qIndex}>
                            <button className="text-left text-body text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
                              {question}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Methods */}
            <div>
              <h2 className="text-section font-bold text-foreground mb-8 text-center">
                Contact Support
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, index) => (
                  <Card key={index} variant="bordered" className="text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <method.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-card-title font-semibold text-foreground mb-2">
                        {method.title}
                      </h3>
                      <p className="text-body text-muted-foreground mb-4">
                        {method.description}
                      </p>
                      <p className="text-caption text-muted-foreground mb-4">
                        {method.available}
                      </p>
                      <Button variant="outline" className="w-full">
                        {method.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Additional Resources */}
            <Card variant="highlight" className="mt-12">
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-card-title font-semibold mb-4">Still Need Help?</h3>
                <p className="text-body text-muted-foreground mb-6">
                  Our community forums are a great place to get help from other networkers 
                  and share your experiences.
                </p>
                <Button className="btn-primary">
                  Visit Community Forums
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
