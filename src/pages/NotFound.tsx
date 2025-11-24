import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectTenant } from "@/utils/tenant";

const NotFound = () => {
  const params = useParams();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  // Get tenant from URL params or detection
  const tenantFromParams = params.tenant;
  const detectedTenant = detectTenant();
  const tenant = tenantFromParams || detectedTenant.tenantId;
  
  // Build tenant-aware home path
  const homePath = tenant && tenant !== 'default' 
    ? `/${tenant}/admin/dashboard` 
    : '/';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-2xl font-semibold text-foreground">
            Page Not Found
          </p>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link to={homePath}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
          <Button asChild className="bg-gradient-primary hover:opacity-90">
            <Link to={homePath}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
