import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold text-foreground">
          Organize Your Developer Resources
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Save, categorize, and share useful programming resources. Your
          personal developer's knowledge base.
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        {isAuthenticated ? (
          <Link to="/dashboard">
            <Button size="lg" className=" cursor-pointer">Go to Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
        <Card>
          <CardHeader>
            <CardTitle>🔗 Save Resources</CardTitle>
            <CardDescription>
              Quickly save docs, repos, blogs, and tools
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏷️ Organize</CardTitle>
            <CardDescription>Categorize with tags and folders</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🚀 Share</CardTitle>
            <CardDescription>Share collections with your team</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}