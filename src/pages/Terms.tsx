
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, AlertTriangle, Scale, Users } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      icon: FileCheck,
      title: "Acceptance of Terms",
      content: "By accessing and using Networker Today, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all users of the platform, including networkers, companies, and visitors."
    },
    {
      icon: Users,
      title: "User Responsibilities",
      content: "Users are responsible for maintaining the confidentiality of their account information, providing accurate information, respecting other users, and complying with all applicable laws and regulations while using our platform."
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: "Users may not engage in spam, harassment, false advertising, pyramid schemes, illegal activities, or any behavior that violates our community guidelines or applicable laws."
    },
    {
      icon: Scale,
      title: "Liability and Disclaimers",
      content: "Networker Today provides the platform 'as is' without warranties. We are not liable for business decisions made based on information found on our platform. Users engage with opportunities at their own risk."
    }
  ];

  return (
    <Layout>
      <div className="w-full">
        <section className="section-spacing">
          <div className="container-modern max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-hero font-bold text-foreground mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Please read these terms carefully before using Networker Today. 
                By using our platform, you agree to comply with these terms.
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
                    <p className="text-body text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card variant="highlight" className="mt-12">
              <CardContent className="p-8 text-center">
                <h3 className="text-card-title font-semibold mb-4">Need Clarification?</h3>
                <p className="text-body text-muted-foreground mb-6">
                  If you have questions about these terms or need legal clarification, 
                  please contact our legal team.
                </p>
                <a 
                  href="mailto:legal@networkertoday.com"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  legal@networkertoday.com
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
}
