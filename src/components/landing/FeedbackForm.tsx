import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const FeedbackForm = () => {
  const { toast } = useToast();

  const handleFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const feedback = formData.get('feedback') as string;

    if (!email || !feedback) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert([{ email, message: feedback }]);

      if (error) throw error;

      toast({
        title: "Thank you!",
        description: "Your feedback has been received.",
      });
      
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleFeedback} className="space-y-4">
      <input
        type="email"
        name="email"
        placeholder="Your email"
        className="w-full p-2 border rounded"
      />
      <textarea
        name="feedback"
        placeholder="Your feedback"
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button
        type="submit"
        className="w-full bg-[#9b87f5] text-white p-2 rounded hover:bg-[#7E69AB]"
      >
        Send Feedback
      </button>
    </form>
  );
};