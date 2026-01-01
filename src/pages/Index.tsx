import { ArrowRight, Heart, Brain, Calendar, Shield, Star, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-health.jpg";

const Index = () => {
  const testimonials = [
    {
      name: "Aditya",
      role: "Health Enthusiast",
      content: "Medisynn has transformed how I manage my health. The AI health checker is incredibly accurate!",
      rating: 5
    },
    {
      name: "Anshika",
      role: "Busy Professional",
      content: "Booking doctors has never been easier. I love the convenience and the mental health support features.",
      rating: 5
    },
    {
      name: "Gaurav",
      role: "Wellness Coach",
      content: "The personalized health insights and wellness tips are game-changing. Highly recommended!",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI Health Checker",
      description: "Get instant health assessments powered by advanced AI technology",
      gradient: "gradient-hero"
    },
    {
      icon: Calendar,
      title: "Easy Doctor Booking",
      description: "Find and book appointments with top doctors in your area",
      gradient: "gradient-success"
    },
    {
      icon: Heart,
      title: "Mental Wellness",
      description: "Access meditation, mood tracking, and emotional support tools",
      gradient: "gradient-hero"
    },
    {
      icon: Shield,
      title: "Emergency Support",
      description: "Quick access to emergency services and contacts when you need them",
      gradient: "gradient-success"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-calm -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Healthcare</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your AI-powered{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  health companion
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Experience the future of healthcare with AI-driven health assessments, easy doctor booking, 
                and comprehensive wellness support - all in one platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/health-checker">
                  <Button size="lg" className="gradient-hero text-primary-foreground shadow-medium hover:shadow-glow transition-smooth group">
                    Check Your Health
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-smooth" />
                  </Button>
                </Link>
                <Link to="/doctors">
                  <Button size="lg" variant="outline" className="border-2 hover:transition-smooth">
                    Find a Doctor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <img
                src={heroImage}
                alt="Happy people using health monitoring"
                className="relative rounded-3xl shadow-large w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Health Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to take control of your health, backed by cutting-edge AI technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 space-y-4">
                  <div className={`w-14 h-14 ${feature.gradient} rounded-xl flex items-center justify-center shadow-soft`}>
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 gradient-calm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied users who trust Medisynn
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="gradient-hero p-12 shadow-large animate-scale-in">
            <CardContent className="space-y-6 p-0">
              <h2 className="text-4xl font-bold text-primary-foreground">
                Ready to Transform Your Health Journey?
              </h2>
              <p className="text-lg text-primary-foreground/90">
                Join Medisynn today and experience the future of personalized healthcare
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link to="/health-checker">
                  <Button size="lg" className="bg-card text-primary hover:bg-card/90 shadow-medium">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
