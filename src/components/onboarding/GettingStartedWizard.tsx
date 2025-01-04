import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle } from "lucide-react";

interface WizardStep {
  title: string;
  description: string;
  completed: boolean;
}

export const GettingStartedWizard = () => {
  const [steps, setSteps] = React.useState<WizardStep[]>([
    {
      title: "Create Your Profile",
      description: "Set up your academic profile and preferences",
      completed: false
    },
    {
      title: "Choose Your Template",
      description: "Select a thesis template that matches your needs",
      completed: false
    },
    {
      title: "Set Up Chapters",
      description: "Organize your thesis structure with chapters and sections",
      completed: false
    },
    {
      title: "Add Collaborators",
      description: "Invite supervisors or co-authors to your project",
      completed: false
    }
  ]);

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;

  const toggleStep = (index: number) => {
    const newSteps = [...steps];
    newSteps[index].completed = !newSteps[index].completed;
    setSteps(newSteps);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
        <CardDescription>
          Complete these steps to set up your thesis project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-4" />
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-accent cursor-pointer"
              onClick={() => toggleStep(index)}
            >
              {step.completed ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground" />
              )}
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};