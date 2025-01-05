import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Star } from "lucide-react";

interface StatsGridProps {
  stats: {
    total: number;
    inProgress: number;
    completed: number;
  };
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#D6BCFA]">Total Theses</CardTitle>
          <FileText className="h-4 w-4 text-[#9b87f5]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </CardContent>
      </Card>
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#D6BCFA]">In Progress</CardTitle>
          <Clock className="h-4 w-4 text-[#9b87f5]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
        </CardContent>
      </Card>
      <Card className="backdrop-blur-xl bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#D6BCFA]">Completed</CardTitle>
          <Star className="h-4 w-4 text-[#9b87f5]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.completed}</div>
        </CardContent>
      </Card>
    </div>
  );
};