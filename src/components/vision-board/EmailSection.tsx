import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

interface EmailSectionProps {
  email: string;
  setEmail: (email: string) => void;
  handleEmailSubmit: () => void;
  isSubmitting: boolean;
  pdfGenerated: boolean;
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const EmailSection = ({ 
  email, 
  setEmail, 
  handleEmailSubmit, 
  isSubmitting, 
  pdfGenerated 
}: EmailSectionProps) => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm border border-purple-100/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
      <div className="relative p-8">
        <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Get Your Comprehensive Review
        </h3>
        <p className="text-gray-600 mb-6">
          Enter your email to receive a detailed vision board review with personalized recommendations, action steps, and a comprehensive PDF report.
        </p>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/50"
            />
            <Button 
              onClick={handleEmailSubmit}
              disabled={!isValidEmail(email) || isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </span>
              )}
            </Button>
          </div>
          {email && !isValidEmail(email) && (
            <div className="text-sm text-red-600 font-medium">
              Please enter a valid email address
            </div>
          )}
          {pdfGenerated && (
            <div className="text-sm text-green-600 font-medium bg-green-50/50 p-3 rounded-lg border border-green-100">
              ✓ Your PDF report has been successfully generated and downloaded!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};