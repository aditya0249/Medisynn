import { useState } from "react";
import { Calendar, Users, MessageSquare, LogIn, Mail, Lock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DoctorDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const appointments = [
    { id: 1, patient: "Sarah Johnson", time: "09:00 AM", type: "Follow-up", status: "confirmed" },
    { id: 2, patient: "Michael Brown", time: "10:30 AM", type: "Consultation", status: "pending" },
    { id: 3, patient: "Emily Davis", time: "02:00 PM", type: "Check-up", status: "confirmed" },
    { id: 4, patient: "Robert Wilson", time: "03:30 PM", type: "Emergency", status: "urgent" }
  ];

  const queries = [
    { id: 1, patient: "Alice Cooper", subject: "Medication refill request", time: "2 hours ago", unread: true },
    { id: 2, patient: "John Smith", subject: "Lab results inquiry", time: "5 hours ago", unread: true },
    { id: 3, patient: "Maria Garcia", subject: "Appointment rescheduling", time: "1 day ago", unread: false }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        <main className="flex-1 flex items-center justify-center pt-24 pb-12">
          <Card className="w-full max-w-md mx-4 shadow-large animate-scale-in">
            <CardHeader className="gradient-hero text-primary-foreground text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <LogIn className="w-6 h-6" />
                Doctor Login
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="doctor@healthmate.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-hero text-primary-foreground shadow-soft hover:shadow-glow transition-smooth">
                  Sign In
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Demo: Use any email and password to login
                </p>
              </form>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, Dr. Williams!</h1>
              <p className="text-lg text-muted-foreground">Here's your schedule for today</p>
            </div>
            <Button onClick={() => setIsLoggedIn(false)} variant="outline">
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-medium card-hover animate-scale-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                    <Calendar className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Badge className="gradient-success text-secondary-foreground">Today</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">4</h3>
                <p className="text-sm text-muted-foreground">Appointments</p>
              </CardContent>
            </Card>

            <Card className="shadow-medium card-hover animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">127</h3>
                <p className="text-sm text-muted-foreground">Total Patients</p>
              </CardContent>
            </Card>

            <Card className="shadow-medium card-hover animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center shadow-soft">
                    <MessageSquare className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Badge className="bg-destructive text-destructive-foreground">2 New</Badge>
                </div>
                <h3 className="text-3xl font-bold mb-1">3</h3>
                <p className="text-sm text-muted-foreground">Patient Queries</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="appointments" className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
              <TabsTrigger value="queries">Patient Queries</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <Card className="shadow-medium">
                <CardHeader className="gradient-hero text-primary-foreground">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Appointment Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="card-hover">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 gradient-hero rounded-full flex items-center justify-center shadow-soft">
                                  <Users className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{appointment.patient}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium">{appointment.time}</p>
                                <Badge 
                                  className={
                                    appointment.status === "urgent" 
                                      ? "bg-destructive text-destructive-foreground" 
                                      : appointment.status === "confirmed"
                                      ? "gradient-success text-secondary-foreground"
                                      : "bg-muted"
                                  }
                                >
                                  {appointment.status}
                                </Badge>
                              </div>
                              <Button size="sm" className="gradient-hero text-primary-foreground">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="queries">
              <Card className="shadow-medium">
                <CardHeader className="gradient-success text-secondary-foreground">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Patient Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {queries.map((query) => (
                      <div 
                        key={query.id} 
                        className={`p-6 hover:bg-muted/50 transition-smooth cursor-pointer ${
                          query.unread ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {query.unread && (
                            <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold">{query.patient}</h3>
                              <span className="text-sm text-muted-foreground">{query.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{query.subject}</p>
                            <Button size="sm" variant="outline" className="mt-3">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDashboard;
