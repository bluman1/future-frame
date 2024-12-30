import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Target, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Discover Your Path to{" "}
            <span className="text-primary">Personal Growth in 2025</span>
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Answer thought-provoking questions and gain valuable insights into your life's journey
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/questionnaire")}
            className="group"
          >
            Start Your Journey
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Brain}
            title="Self-Discovery"
            description="Gain deep insights into your personal values, goals, and aspirations"
          />
          <FeatureCard
            icon={Target}
            title="Clear Direction"
            description="Get clarity on your life's purpose and create actionable plans"
          />
          <FeatureCard
            icon={Sparkles}
            title="Personal Growth"
            description="Transform insights into meaningful personal development"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-6 rounded-lg bg-card border shadow-sm hover:shadow-md transition-shadow animate-fade-up">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Landing;