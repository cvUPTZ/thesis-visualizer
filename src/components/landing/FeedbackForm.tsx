import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Star } from "lucide-react";

export const FeedbackForm = () => {
  const { toast } = useToast();
  const [rating, setRating] = React.useState<number>(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const message = formData.get('feedback') as string;

    if (!email || !message || !rating) {
      toast({
        title: "Error",
        description: "Please fill in all fields and provide a rating",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert([{
          email,
          message,
          rating,
        }]);

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feedback has been received.",
      });

      (event.target as HTMLFormElement).reset();
      setRating(0);
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-[#F1F0FB]">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#1A1F2C]">Share Your Feedback</h2>
          <p className="text-gray-600">Help us improve your thesis writing experience</p>
        </div>
        
        <form onSubmit={handleFeedback} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 rounded-full transition-colors ${
                    rating >= star ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-8 h-8" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Share your thoughts..."
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-[#9b87f5] hover:bg-[#7E69AB]"
            disabled={isSubmitting}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Feedback"}
          </Button>
        </form>
      </div>
    </section>
  );
};