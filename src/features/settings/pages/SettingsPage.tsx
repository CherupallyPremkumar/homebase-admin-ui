import { useState } from 'react';
import { Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { notification } from '@/services/notification';

export default function Settings() {
  const [brandName, setBrandName] = useState('HomeDecor');
  const [primaryColor, setPrimaryColor] = useState('#D97757');
  const [secondaryColor, setSecondaryColor] = useState('#8BA888');

  const handleSave = () => {
    // TODO: Implement theme save to backend
    notification.success('Settings saved', 'Your theme preferences have been updated');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and theme</p>
      </div>

      {/* Theme Settings */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Customization
          </CardTitle>
          <CardDescription>
            Customize your brand's visual identity (Multi-tenant support)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Your brand name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color (Terracotta)</Label>
              <div className="flex gap-3">
                <Input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#D97757"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Used for buttons, links, and primary actions
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color (Sage Green)</Label>
              <div className="flex gap-3">
                <Input
                  id="secondaryColor"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-20 h-10 cursor-pointer"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#8BA888"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Used for accents and secondary elements
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Multi-tenant Info */}
      <Card className="shadow-soft bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Multi-tenant Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            This dashboard supports multi-tenant architecture. Each brand can have its own:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
            <li>Custom color scheme and branding</li>
            <li>Isolated product catalog</li>
            <li>Separate customer database</li>
            <li>Independent order management</li>
          </ul>
          <p className="text-xs text-muted-foreground pt-2">
            API calls include X-Tenant-ID header for tenant isolation
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
