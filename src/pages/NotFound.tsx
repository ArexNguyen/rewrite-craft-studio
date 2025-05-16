
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-extrabold text-brand-600">404</h1>
        <p className="text-2xl font-semibold mt-4 mb-6">Page not found</p>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
        </p>
        <Button size="lg" asChild>
          <Link to="/">
            Return home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
