import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface TourStep {
  title: string;
  description: string;
  target: string;
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to Your Thesis Journey",
    description: "Let's take a quick tour of the main features to help you get started.",
    target: "welcome-step"
  },
  {
    title: "Create Your First Thesis",
    description: "Click here to start a new thesis project. You can choose from various templates or start from scratch.",
    target: "create-thesis"
  },
  {
    title: "Organize Your Content",
    description: "Use the sidebar to navigate through different sections of your thesis.",
    target: "thesis-sidebar"
  },
  {
    title: "Collaborate with Others",
    description: "Invite collaborators to work on your thesis in real-time.",
    target: "collaboration"
  }
];

export const GuidedTour = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [currentStep, setCurrentStep] = React.useState(0);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      toast({
        title: "Tour Completed!",
        description: "You're now ready to start working on your thesis.",
      });
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    toast({
      title: "Tour Skipped",
      description: "You can restart the tour anytime from the help menu.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tourSteps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {tourSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handleSkip}>
            Skip Tour
          </Button>
          <Button onClick={handleNext}>
            {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};