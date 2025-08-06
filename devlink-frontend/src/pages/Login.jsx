import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your DevLink account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Sign In (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}