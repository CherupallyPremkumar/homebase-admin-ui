import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, Save, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { profileApi } from '@/services/api';
import { notification } from '@/services/notification';
import { AdminProfile } from '@/types/profile';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s()-]+$/, 'Invalid phone number').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const data = await profileApi.get();
      setProfile(data);
      setAvatarUrl(data.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin');
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
      });
    } catch (error) {
      notification.error('Failed to load profile', 'Please try again later');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      notification.error('File too large', 'Please select an image under 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notification.error('Invalid file type', 'Please select an image file');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const response = await profileApi.uploadAvatar(file);
      setAvatarUrl(response.avatarUrl);
      
      notification.success('Avatar updated successfully');
    } catch (error) {
      notification.error('Failed to upload avatar', 'Please try again');
      // Revert to original avatar on error
      if (profile?.avatarUrl) setAvatarUrl(profile.avatarUrl);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const updated = await profileApi.update({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
      });
      
      setProfile(updated);
      notification.success('Profile updated successfully', 'Your changes have been saved');
    } catch (error) {
      notification.error('Failed to update profile', 'Please check your information and try again');
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Failed to load profile</p>
        <Button onClick={loadProfile} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
              <div>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
                <Label htmlFor="avatar" className="cursor-pointer">
                  <Button 
                    type="button" 
                    variant="outline" 
                    asChild
                    disabled={isUploadingAvatar}
                  >
                    <span>
                      {isUploadingAvatar ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                    </span>
                  </Button>
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    {...register('name')}
                    className="pl-9"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="pl-9"
                    placeholder="admin@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    {...register('phone')}
                    className="pl-9"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={profile.role}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Role cannot be changed</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
