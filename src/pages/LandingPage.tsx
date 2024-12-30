import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

        // Simple email format check
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-8">
            <div className="max-w-3xl space-y-8 text-center bg-white bg-opacity-80 rounded-lg shadow-xl p-8">
                {/* Header Section */}
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                    Welcome to Thesis Visualizer
                </h1>
                <p className="text-xl text-gray-700">
                    Craft your academic papers with ease. This tool provides a structured approach to help you in writing and organizing your work.
                    Start by creating a new thesis.
                </p>

                {/* How to Use Section */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-semibold">How to use the tool</h2>
                    <ol className="list-decimal list-inside space-y-2 text-left">
                        <li><span className="font-medium">Create a New Thesis</span>: Begin by clicking the "Create New Thesis" button after logging in.</li>
                        <li><span className="font-medium">Work with your content</span>: Add chapters, sections, figures, and tables to organize your work.</li>
                        <li><span className="font-medium">Preview and Export</span>: Use the preview to see how your document will look and export to DOCX as needed.</li>
                    </ol>
                </div>

                {/* Feedback Section */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-semibold">Provide Feedback</h2>
                    <p className="text-lg text-gray-700">We'd love to hear from you. Share your thoughts and suggestions to help us improve!</p>
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 shadow-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Textarea
                            placeholder="Your feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 shadow-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Button onClick={sendFeedback} className="w-full py-2 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-pink-600 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-pink-700">
                            Send Feedback
                        </Button>
                    </div>
                </div>

                {/* Call to Action Button */}
                <Link to="/auth">
                    <Button variant="outline" className="w-full py-2 text-lg font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300">
                        Go to App
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
