import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProtectedRoute } from "./features/auth/components/ProtectedRoute";
import { DashboardLayout } from "./features/layout/components/DashboardLayout";
import Login from "./features/auth/pages/LoginPage";
import ForgotPassword from "./features/auth/pages/ForgotPasswordPage";
import PartnerRegister from "./features/auth/pages/PartnerRegisterPage";
import NotFound from "./pages/NotFound";

// Module Registry
import { moduleRegistry } from "@/lib/module-registry";
import { dashboardModule } from "@/features/dashboard";
import { productsModule } from "@/features/products";
import { ordersModule } from "@/features/orders";
import { categoriesModule } from "@/features/categories";
import { customersModule } from "@/features/customers";
import { settingsModule } from "@/features/settings";

// Register Modules
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

              {/* Protected Routes - Tenant-aware */}
              <Route
                path="/:tenant/admin/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Routes>
                        {moduleRegistry.getRoutes().map((route, i) => (
                          <Route key={i} path={route.path} element={route.element} />
                        ))}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
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
                      <Routes>
                        {moduleRegistry.getRoutes().map((route, i) => (
                          <Route key={i} path={route.path} element={route.element} />
                        ))}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
