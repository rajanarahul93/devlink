import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { resourceAPI } from "../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, BookOpen, Eye, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalResources: 0,
    publicResources: 0,
    totalClicks: 0,
    recentResources: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await resourceAPI.getResources({ limit: 5 });
        const { resources, total } = response.data;

        const publicCount = resources.filter((r) => r.is_public).length;
        const totalClicks = resources.reduce(
          (sum, r) => sum + r.click_count,
          0
        );

        setStats({
          totalResources: total,
          publicResources: publicCount,
          totalClicks,
          recentResources: resources,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted animate-pulse rounded-lg h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's an overview of your developer resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResources}</div>
            <p className="text-xs text-muted-foreground">
              Resources in your collection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Public Resources
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publicResources}</div>
            <p className="text-xs text-muted-foreground">
              Shared with the community
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Across all your resources
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Resources</CardTitle>
            <CardDescription>Your latest saved resources</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentResources.length > 0 ? (
              <div className="space-y-3">
                {stats.recentResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {resource.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {resource.category} • {resource.click_count} clicks
                      </p>
                    </div>
                  </div>
                ))}
                <Link to="/resources">
                  <Button variant="outline" className="w-full mt-4">
                    View All Resources
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No resources yet</p>
                <Link to="/resources">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Resource
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your resources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/resources">
              <Button className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Resource
              </Button>
            </Link>
            <Link to="/resources">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse My Collection
              </Button>
            </Link>
            <Link to="/resources?is_public=true">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                Manage Public Resources
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}