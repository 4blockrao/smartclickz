
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageSquare
} from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "support@networkertoday.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Mon-Fri 9AM-6PM EST"
    },
    {
      icon: MapPin,
      title: "Office",
      details: "123 Business Avenue, Suite 100",
      description: "New York, NY 10001"
    },
    {
      icon: Clock,
      title: "Support Hours",
      details: "Monday - Friday",
      description: "9:00 AM - 6:00 PM EST"
    }
  ];

  return (
    <Layout>
      <div className="w-full">
        <section className="section-spacing">
          <div className="container-modern max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-hero font-bold text-foreground mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have questions, feedback, or need support? We're here to help. 
                Reach out to us through any of the methods below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" className="input-modern" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" className="input-modern" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" className="input-modern" />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" className="input-modern" />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        rows={6}
                        className="input-modern"
                        placeholder="Tell us how we can help..."
                      />
                    </div>
                    
                    <Button type="submit" className="w-full btn-primary">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card variant="highlight">
                  <CardContent className="p-6">
                    <h3 className="text-card-title font-semibold mb-4">Get in Touch</h3>
                    <p className="text-body text-muted-foreground">
                      We're committed to providing excellent support to our community. 
                      Whether you're a new user or a long-time member, we're here to help you succeed.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => (
                    <Card key={index} variant="interactive">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <info.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">
                              {info.title}
                            </h4>
                            <p className="text-body text-foreground mb-1">
                              {info.details}
                            </p>
                            <p className="text-caption text-muted-foreground">
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card variant="bordered">
                  <CardContent className="p-6 text-center">
                    <h4 className="font-semibold text-foreground mb-2">
                      Prefer Live Chat?
                    </h4>
                    <p className="text-body text-muted-foreground mb-4">
                      Get instant help with our live chat support available 24/7.
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Live Chat
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
