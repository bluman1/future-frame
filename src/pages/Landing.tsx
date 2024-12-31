import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Brain, Target, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-8 max-w-3xl mx-auto animate-fade-up">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Your Path to{" "}
              <span className="block mt-2">Personal Growth in 2025</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Answer thought-provoking questions and gain valuable insights into your life's journey
            </p>
          </div>

          <Button
            size="lg"
            onClick={() => navigate("/questionnaire")}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Journey
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Brain}
            title="Self-Discovery"
            description="Gain deep insights into your personal values, goals, and aspirations"
            gradient="from-blue-500 to-purple-500"
          />
          <FeatureCard
            icon={Target}
            title="Clear Direction"
            description="Get clarity on your life's purpose and create actionable plans"
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={Sparkles}
            title="Personal Growth"
            description="Transform insights into meaningful personal development"
            gradient="from-pink-500 to-rose-500"
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
  gradient,
}: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
}) => {
  return (
    <div className="group relative p-8 rounded-2xl bg-white border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${gradient}`} />
      <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${gradient} p-3 shadow-lg`}>
        <Icon className="w-full h-full text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default Landing;