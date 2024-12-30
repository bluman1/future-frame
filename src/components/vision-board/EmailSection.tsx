import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailSectionProps {
  email: string;
  setEmail: (email: string) => void;
  handleEmailSubmit: () => void;
  isSubmitting: boolean;
  pdfGenerated: boolean;
}

export const EmailSection = ({ 
  email, 
  setEmail, 
  handleEmailSubmit, 
  isSubmitting, 
  pdfGenerated 
}: EmailSectionProps) => {
  return (
    <div className="p-6 rounded-xl bg-secondary/50 backdrop-blur-sm">
      <h3 className="text-xl font-semibold mb-4">Get Your Comprehensive Review</h3>
      <p className="text-muted-foreground mb-4">
        Enter your email to receive a detailed vision board review with personalized recommendations, action steps, and a comprehensive PDF report.
      </p>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleEmailSubmit}
            disabled={!email || isSubmitting}
          >
            {isSubmitting ? "Generating..." : "Download PDF Report"}
          </Button>
        </div>
        {pdfGenerated && (
          <div className="text-sm text-green-600 font-medium">
            ✓ Your PDF report has been successfully generated and downloaded!
          </div>
        )}
      </div>
    </div>
  );
};