import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LandingPage = () => {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
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

    // Simple email format check
    const emailPattern =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      toast({
        title: "Error",
        description: "Please provide a valid email address.",
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
      setFeedback("");
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send feedback.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-inter">
      {/* Hero Section */}
      <div className="flex flex-col justify-center items-center text-center px-6 py-24 md:py-48 max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400 mb-6">
          Welcome to Thesis Visualizer
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          A smarter way to organize and write your academic papers. Visualize,
          structure, and create your thesis with ease using our intuitive tool.
        </p>
        <Link to="/auth">
          <Button className="px-6 py-3 text-lg font-semibold bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300">
            Get Started
          </Button>
        </Link>
      </div>

      {/* How to Use Section */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8">How to Use the Tool</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-gray-800">1. Create a New Thesis</h3>
              <p className="text-gray-600">
                Start by clicking the "Create New Thesis" button after logging in.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-gray-800">2. Work with Your Content</h3>
              <p className="text-gray-600">
                Add chapters, sections, tables, and figures to organize your thesis.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-medium text-gray-800">3. Preview and Export</h3>
              <p className="text-gray-600">
                See a live preview of your document and export it to DOCX when you're ready.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 py-16">
        <div className="max-w-2xl mx-auto text-center px-6 text-white">
          <h2 className="text-4xl font-semibold mb-6">We Value Your Feedback</h2>
          <p className="text-lg mb-8">
            We’re constantly working to improve. Share your thoughts with us, and help
            us make Thesis Visualizer even better.
          </p>
          <div className="space-y-6">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
            />
            <Textarea
              placeholder="Your feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={sendFeedback}
              className="w-full px-6 py-3 text-lg font-semibold bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300"
            >
              Send Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gray-900 text-white py-8 text-center">
        <p className="text-lg">&copy; 2024 Thesis Visualizer. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage;
