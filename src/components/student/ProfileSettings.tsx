import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Camera, Mail, Bell, Linkedin, User, Settings, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useStudentPortalContext } from "@/pages/StudentPortal";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { user, signInWithOAuth } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { session } = useStudentPortalContext();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    linkedinConnected: false,
    avatar: ""
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    applicationUpdates: true,
    marketingEmails: false,
    academicReminders: true
  });

  // Initialize profile data from real user data
  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        address: "", // Add address field to profile if needed
        bio: profile.bio || "",
        linkedinConnected: false, // Will implement OAuth check
        avatar: profile.avatar_url || ""
      });
      
      setNotifications({
        emailNotifications: profile.notification_email ?? true,
        smsNotifications: profile.notification_sms ?? false,
        applicationUpdates: profile.notification_in_app ?? true,
        marketingEmails: false,
        academicReminders: true
      });
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({
      ...notifications,
      [key]: value
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData({
          ...profileData,
          avatar: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been updated successfully."
      });
    }
  };

  const handleLinkedInConnect = async () => {
    if (profileData.linkedinConnected) {
      // Disconnect LinkedIn (in a real app, you'd revoke the OAuth token)
      setProfileData({
        ...profileData,
        linkedinConnected: false
      });
      
      toast({
        title: "LinkedIn Disconnected",
        description: "Your LinkedIn profile has been disconnected."
      });
    } else {
      // Connect to LinkedIn using Supabase OAuth
      try {
        // For now, simulate LinkedIn connection since it's not in the auth provider types
        // In a real implementation, you'd use the Supabase OAuth with LinkedIn
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful connection
        setProfileData({
          ...profileData,
          linkedinConnected: true
        });
        
        toast({
          title: "LinkedIn Connected",
          description: "Your LinkedIn profile has been connected successfully."
        });
      } catch (err) {
        toast({
          title: "Connection Error",
          description: "An error occurred while connecting to LinkedIn.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Update profile data
      const updates = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        bio: profileData.bio,
        avatar_url: profileData.avatar,
        notification_email: notifications.emailNotifications,
        notification_sms: notifications.smsNotifications,
        notification_in_app: notifications.applicationUpdates
      };

      const { error } = await updateProfile(updates);
      
      if (error) {
        toast({
          title: "Update Failed",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile settings have been saved successfully."
        });
        onOpenChange(false);
      }
    } catch (err) {
      toast({
        title: "Update Error",
        description: "An error occurred while saving your profile.",
        variant: "destructive"
      });
    }
  };

  const handlePasswordReset = () => {
    navigate('/reset-password');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Manage your profile information, notifications, and account settings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Photo Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.avatar} alt="Profile photo" />
                <AvatarFallback className="text-lg">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Camera className="h-4 w-4" />
                    Upload Photo
                  </div>
                </Label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  placeholder="Street address, City, Province"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                placeholder="Tell us a bit about yourself..."
                className="min-h-24"
              />
            </div>

            {/* LinkedIn Connection */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Linkedin className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">LinkedIn Profile</h3>
                    <p className="text-sm text-gray-600">
                      {profileData.linkedinConnected 
                        ? "Your LinkedIn profile is connected" 
                        : "Connect your LinkedIn profile to enhance your professional network"
                      }
                    </p>
                  </div>
                </div>
                <Badge variant={profileData.linkedinConnected ? "default" : "outline"}>
                  {profileData.linkedinConnected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              <Button 
                variant={profileData.linkedinConnected ? "outline" : "default"}
                onClick={handleLinkedInConnect}
                className="w-full"
              >
                {profileData.linkedinConnected ? "Disconnect LinkedIn" : "Connect LinkedIn"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Communication Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive important updates via email</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-gray-600">Receive urgent alerts via SMS</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.smsNotifications}
                    onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Application Updates</div>
                      <div className="text-sm text-gray-600">Updates on your application status</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.applicationUpdates}
                    onChange={(e) => handleNotificationChange('applicationUpdates', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Academic Reminders</div>
                      <div className="text-sm text-gray-600">Deadlines and important academic dates</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.academicReminders}
                    onChange={(e) => handleNotificationChange('academicReminders', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Marketing Emails</div>
                      <div className="text-sm text-gray-600">News, events, and promotional content</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.marketingEmails}
                    onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Account Information</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Student ID:</span>
                  <span className="text-sm">{session?.id?.slice(-8) || profile?.student_id || 'Not assigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Program:</span>
                  <span className="text-sm">{session?.programs_applied?.[0] || 'Not enrolled'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Enrollment Status:</span>
                  <Badge variant="default">{session?.status || 'Active'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Account Created:</span>
                  <span className="text-sm">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="outline" className="w-full" onClick={handlePasswordReset}>
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  Download Account Data
                </Button>
                <Button variant="destructive" className="w-full">
                  Deactivate Account
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;