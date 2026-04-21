
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      icon: FileText,
      title: "Information We Collect",
      content: [
        "Account information (email, name, profile details)",
        "Usage data and platform interactions",
        "Communications and messages sent through our platform",
        "Device and browser information for security purposes"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our platform services",
        "To facilitate connections between network marketers",
        "To send important updates and communications",
        "To maintain platform security and prevent fraud"
      ]
    },
    {
      icon: Shield,
      title: "Information Protection",
      content: [
        "Industry-standard encryption for all data transmission",
        "Secure servers with regular security audits",
        "Limited access to personal information by staff",
        "Regular backups with encrypted storage"
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        "We never sell your personal information to third parties",
        "Profile information is shared based on your privacy settings",
        "Legal compliance may require information disclosure",
        "Anonymous analytics may be shared with trusted partners"
      ]
    }
  ];

  return (
    <Layout>
      <div className="w-full">
        <section className="section-spacing">
          <div className="container-modern max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-hero font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your privacy is important to us. This policy explains how we collect, 
                use, and protect your personal information on Networker Today.
              </p>
              <p className="text-caption text-muted-foreground mt-4">
                Last updated: December 2024
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index} variant="bordered">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                          <span className="text-body text-minted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card variant="highlight" className="mt-12">
              <CardContent className="p-8 text-center">
                <h3 className="text-card-title font-semibold mb-4">Questions About Our Privacy Policy?</h3>
                <p className="text-body text-muted-foreground mb-6">
                  If you have any questions about how we handle your privacy, 
                  please don't hesitate to contact our support team.
                </p>
                <a 
                  href="mailto:privacy@networkertoday.com"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  privacy@networkertoday.com
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
