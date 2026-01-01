import { useState, useEffect } from "react";
import { Calendar, User, ArrowRight, BookOpen, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const categories = ["All", "Nutrition", "Fitness", "Mental Health", "Wellness", "Preventive Care"];

  const articles = [
  {
    title: "10 Superfoods to Boost Your Immune System",
    excerpt: "Discover the power of natural immunity boosters and how to incorporate them into your daily diet.",
    category: "Nutrition",
    content: `Superfoods are nutrient-rich foods that boost your health. Include blueberries, kale, and salmon in your diet. Eat a variety to ensure you get antioxidants, vitamins, and minerals. Hydration and regular exercise complement the effects of these superfoods.`
  },
  {
    title: "Managing Stress in the Digital Age",
    excerpt: "Learn effective strategies to maintain mental wellness in our always-connected world.",
    category: "Mental Health",
    content: `Digital stress comes from constant notifications and screen time. Take 5-minute breaks every hour, practice deep breathing, and set boundaries for device use. Meditation apps or walks in nature can greatly reduce stress levels.`
  },
  {
    title: "The Science of Better Sleep",
    excerpt: "Explore evidence-based techniques to improve your sleep quality and overall health.",
    category: "Wellness",
    content: `Better sleep improves memory, mood, and immunity. Stick to a sleep schedule, keep your bedroom cool and dark, avoid screens 1 hour before bed, and limit caffeine intake. Try relaxation techniques like progressive muscle relaxation.`
  },
  {
    title: "Heart Health: Prevention is Key",
    excerpt: "Understanding cardiovascular health and simple lifestyle changes that make a big difference.",
    category: "Preventive Care",
    content: `Heart disease can be prevented with a balanced diet, regular exercise, and stress management. Include fruits, vegetables, whole grains, and lean proteins. Avoid smoking and excessive alcohol. Monitor blood pressure and cholesterol regularly.`
  },
  {
    title: "Building a Sustainable Fitness Routine",
    excerpt: "Create an exercise plan that fits your lifestyle and keeps you motivated long-term.",
    category: "Fitness",
    content: `Consistency is key in fitness. Mix strength training, cardio, and flexibility exercises. Set realistic goals, track progress, and adjust routines every few months. Listen to your body to avoid burnout and injuries.`
  },
  {
    title: "Understanding Your Mental Health Triggers",
    excerpt: "Identify and manage emotional triggers to improve your mental wellness journey.",
    category: "Mental Health",
    content: `Triggers vary from person to person, like stressful situations or negative self-talk. Keep a journal to track patterns, practice mindfulness, and seek professional support when needed. Self-care routines strengthen resilience.`
  }
];


  const aiTips = [
    "💧 Hydration Tip: Drink a glass of water first thing in the morning to kickstart your metabolism",
    "🧘 Wellness Insight: Just 5 minutes of deep breathing can significantly reduce stress levels",
    "🏃 Fitness Fact: Regular walking for 30 minutes daily can reduce heart disease risk by 19%",
    "😴 Sleep Science: Keeping your bedroom cool (60-67°F) promotes better sleep quality"
  ];

  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  const openModal = (article) => {
    setSelectedArticle(article);
    setIsModalVisible(true);
    setTimeout(() => setIsAnimating(true), 10); // trigger enter animation
  };

  const closeModal = () => {
    setIsAnimating(false); // start exit animation
  };

  useEffect(() => {
    if (!isAnimating && selectedArticle) {
      const timer = setTimeout(() => setIsModalVisible(false), 300); // wait for animation
      return () => clearTimeout(timer);
    }
  }, [isAnimating, selectedArticle]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">Health & Wellness Blog</h1>
            <p className="text-lg text-muted-foreground">
              Expert insights and tips for a healthier lifestyle
            </p>
          </div>

          {/* AI Tips */}
          <Card className="gradient-hero mb-8 shadow-large animate-scale-in">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                AI-Powered Health Tips
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {aiTips.map((tip, index) => (
                  <div key={index} className="bg-card/20 backdrop-blur rounded-xl p-4 text-primary-foreground">
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
                className={`whitespace-nowrap ${
                  selectedCategory === category 
                    ? "gradient-hero text-primary-foreground" 
                    : ""
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <Card
                key={index}
                className="card-hover animate-fade-in flex flex-col bg-white
    border-2 border-gray-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 flex flex-col flex-1 justify-between">
                  {/* Top content */}
                  <div className="space-y-4">
                    <Badge className="gradient-success text-secondary-foreground">
                      {article.category}
                    </Badge>
                    <h3 className="text-xl font-bold leading-tight">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                  </div>

                  {/* Button at bottom */}
                  <Button
                    className="mt-4 w-full gradient-hero text-primary-foreground shadow-soft hover:shadow-glow transition-smooth group"
                    onClick={() => openModal(article)}
                  >
                    Read Article
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-smooth" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal */}
      {isModalVisible && selectedArticle && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-card rounded-xl shadow-xl max-w-2xl w-full p-6 transform transition-transform duration-300 ${
              isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedArticle.title}</h2>
              <Button
  onClick={closeModal}
  className="p-1 rounded-full bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent shadow-none"
>
  <X className="w-5 h-5" style={{ color: '#000000' }} />
</Button>

            </div>
            <Badge className="mb-2 gradient-success text-secondary-foreground">
              {selectedArticle.category}
            </Badge>
            
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {selectedArticle.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
