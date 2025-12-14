import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SellerProvider } from "./contexts/SellerContext";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { DashboardLayout } from "./features/layout/components/DashboardLayout";
import { RoleBasedRoutes } from "./routes/RoleBasedRoutes";
import Login from "./features/auth/pages/LoginPage";
import ForgotPassword from "./features/auth/pages/ForgotPasswordPage";
import PartnerRegister from "./features/auth/pages/PartnerRegisterPage";
import PricingDemoPage from "./pages/products/PricingDemoPage";
import CreateProductPage from "./pages/products/CreateProductPage";

// Module Registry - for sidebar navigation
import { moduleRegistry } from "@/lib/module-registry";
import { dashboardModule } from "@/features/dashboard";
import { productsModule } from "@/features/products";
import { ordersModule } from "@/features/orders";
import { categoriesModule } from "@/features/categories";
import { customersModule } from "@/features/customers";
import { settingsModule } from "@/features/settings";

// Register modules for sidebar (routes handled by RoleBasedRoutes)
moduleRegistry.register(dashboardModule);
moduleRegistry.register(productsModule);
moduleRegistry.register(ordersModule);
moduleRegistry.register(categoriesModule);
moduleRegistry.register(customersModule);
moduleRegistry.register(settingsModule);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <SellerProvider>
            <NotificationProvider>
              <Toaster />
              <Sonner
                position="top-right"
                expand={true}
                richColors
                closeButton
                toastOptions={{
                  className: "bg-card text-foreground border-border",
                  duration: 4000,
                }}
              />
              <Routes>
                {/* Public Routes - Support both root and tenant-specific */}
                <Route path="/login" element={<Login />} />
                <Route path="/:tenant/admin/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/:tenant/admin/forgot-password" element={<ForgotPassword />} />
                <Route path="/partner/register" element={<PartnerRegister />} />
                <Route path="/pricing-demo" element={<PricingDemoPage />} />
                <Route path="/create-product" element={<CreateProductPage />} />

                {/* Protected Routes - Tenant-aware with Role-Based Routing */}
                <Route
                  path="/:tenant/admin/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <RoleBasedRoutes />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Legacy routes (non-tenant) - Redirect to default tenant */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <RoleBasedRoutes />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </NotificationProvider>
          </SellerProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

