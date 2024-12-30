// src/pages/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const LandingPage = () => {
    const [feedback, setFeedback] = useState('');
    const [email, setEmail] = useState('');
    const { toast } = useToast();

    const sendFeedback = async () => {
        if (!feedback.trim()) {
            toast({
                title: "Error",
                description: "Feedback cannot be empty.",
                variant: "destructive",
            });
            return;
        }

         if (!email.trim()) {
          toast({
            title: "Error",
            description: "Email cannot be empty.",
            variant: "destructive",
          });
            return;
         }

       try {
          const { error } = await supabase
          .from("feedback")
          .insert({
             email,
             content: feedback,
             created_at: new Date().toISOString(),
          });

          if (error) {
            throw error;
          }

          toast({
             title: "Success",
            description: "Thank you for your feedback!",
          });
          setFeedback('');
          setEmail('');
        } catch (error: any) {
            toast({
              title: "Error",
              description: error.message || "Failed to send feedback.",
              variant: "destructive",
            });
        }
    };
    
    
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl space-y-8 text-center">
        <h1 className="text-4xl font-serif font-bold">
          Welcome to Thesis Visualizer
        </h1>
          <p className="text-lg">
          Craft your academic papers with ease. This tool provides a structured approach to help you in writing and organizing your work. Start by creating a new thesis.
        </p>
        <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold">How to use the tool</h2>
              <p>
                 1. <span className="font-medium">Create a New Thesis</span>: Begin by clicking the "Create New Thesis" button after loging in.
                </p>
            <p>
                  2.  <span className="font-medium">Work with your content</span>: Dive into the editor. Add chapters, sections, figures, and tables.
             </p>
            <p>
               3. <span className="font-medium">Preview and Export</span>: Use the preview to see how your document will look and export to DOCX as needed.
                </p>
          </div>
          <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold">Provide Feedback</h2>
              <p>We'd love to hear from you. Share your thoughts and suggestions.</p>
             <Input
                 type="email"
                 placeholder="Your email address"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
              />
              <Textarea
                placeholder="Your feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-2"
              />
              <Button onClick={sendFeedback} className="mt-2 w-full">Send Feedback</Button>
          </div>
        <Link to="/auth">
          <Button variant="outline">Go to App</Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;