import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../theme/ThemeToggle";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold text-primary">
              DevLink
            </Link>
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-6">
                <Link
                  to="/dashboard"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/resources"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  My Resources
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}!
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}