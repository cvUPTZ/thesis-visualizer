import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Users, Clock, FileText, Star } from "lucide-react";
import { ThesisList } from "@/components/thesis/ThesisList";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [thesesStats, setThesesStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      console.log("Fetching user profile for:", userId);
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(`
          *,
          roles (
            name
          )
        `)
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      console.log("Fetched profile:", profile);
      setUserProfile(profile);
    };

    const fetchThesesStats = async () => {
      if (!userId) return;
      
      console.log("Fetching theses stats for:", userId);
      const { data: theses, error } = await supabase
        .from("thesis_collaborators")
        .select("thesis_id")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching theses:", error);
        return;
      }

      console.log("Fetched theses:", theses);
      setThesesStats({
        total: theses?.length || 0,
        inProgress: theses?.length || 0,
        completed: 0,
      });
    };

    fetchUserProfile();
    fetchThesesStats();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* User Profile Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Welcome, {userProfile?.email}
          </h1>
          <p className="text-gray-600">
            Role: {userProfile?.roles?.name || "User"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Theses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thesesStats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thesesStats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thesesStats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-semibold text-primary">
            Your Theses
          </h2>
          <Button
            onClick={() => navigate("/create-thesis")}
            className="bg-primary hover:bg-primary-light text-white"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Start New Thesis
          </Button>
        </div>

        {/* Thesis List */}
        <div className="bg-white rounded-lg shadow">
          <ThesisList />
        </div>

        {/* Quick Tips Section */}
        <div className="mt-8 bg-editor-bg rounded-lg p-8">
          <h2 className="text-xl font-serif font-semibold text-primary mb-4">
            Quick Tips
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Getting Started</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Click "Start New Thesis" to create your document</li>
                <li>Use the editor toolbar for formatting options</li>
                <li>Add collaborators through the sharing menu</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Regularly save your work (though we auto-save too!)</li>
                <li>Use headings to organize your content</li>
                <li>Preview your work in different formats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;