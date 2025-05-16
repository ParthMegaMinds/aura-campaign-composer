
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import AivaLogo from "@/components/AivaLogo";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/20">
      <div className="text-center px-6 py-10">
        <AivaLogo className="mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4 text-aiva-700">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! We couldn't find the page you're looking for</p>
        <Button 
          onClick={() => navigate("/")}
          className="animated-gradient text-white"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
