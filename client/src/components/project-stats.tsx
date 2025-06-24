import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, CheckCircle, Clock, DollarSign } from "lucide-react";

export default function ProjectStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                <div className="ml-4">
                  <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-12 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsConfig = [
    {
      title: "総案件数",
      value: stats?.totalProjects || 0,
      icon: Briefcase,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "進行中",
      value: stats?.activeProjects || 0,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "期限間近",
      value: stats?.urgentProjects || 0,
      icon: Clock,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "今月売上",
      value: stats?.monthlyRevenue || "¥0M",
      icon: DollarSign,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-8 h-8 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">{stat.title}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
