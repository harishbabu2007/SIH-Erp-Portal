'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Moon, 
  Globe, 
  Shield, 
  Smartphone,
  Mail,
  MessageSquare,
  Volume2,
  Eye,
  Lock,
  Database,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { authService, User } from '@/lib/auth';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      examReminders: true,
      feeReminders: true,
      admissionUpdates: true,
      systemUpdates: false
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'Asia/Kolkata'
    },
    privacy: {
      profileVisibility: 'private',
      showEmail: false,
      showPhone: false,
      dataCollection: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30',
      loginAlerts: true
    }
  });
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!user) {
    return null;
  }

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save settings to the database
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    console.log('Exporting user data...');
    alert('Data export initiated. You will receive an email with your data.');
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog and delete the account
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
      console.log('Deleting account...');
      alert('Account deletion initiated. Please check your email for confirmation.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/40">
      <Navbar user={user} currentPage="settings" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
            </div>
            <Button onClick={handleSaveSettings}>
              Save All Changes
            </Button>
          </div>

          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified about important updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Channels</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.email}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.push}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.notifications.sms}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Exam Reminders</Label>
                          <p className="text-sm text-muted-foreground">Get notified about upcoming exams</p>
                        </div>
                        <Switch
                          checked={settings.notifications.examReminders}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'examReminders', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Fee Reminders</Label>
                          <p className="text-sm text-muted-foreground">Get notified about pending fee payments</p>
                        </div>
                        <Switch
                          checked={settings.notifications.feeReminders}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'feeReminders', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Admission Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about admission status changes</p>
                        </div>
                        <Switch
                          checked={settings.notifications.admissionUpdates}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'admissionUpdates', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>System Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified about system maintenance and updates</p>
                        </div>
                        <Switch
                          checked={settings.notifications.systemUpdates}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'systemUpdates', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Moon className="h-5 w-5" />
                    <span>Appearance & Language</span>
                  </CardTitle>
                  <CardDescription>Customize how the application looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select
                        value={settings.appearance.theme}
                        onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={settings.appearance.language}
                        onValueChange={(value) => handleSettingChange('appearance', 'language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="mr">Marathi</SelectItem>
                          <SelectItem value="gu">Gujarati</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select
                        value={settings.appearance.timezone}
                        onValueChange={(value) => handleSettingChange('appearance', 'timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Privacy & Data</span>
                  </CardTitle>
                  <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Profile Visibility</Label>
                      <Select
                        value={settings.privacy.profileVisibility}
                        onValueChange={(value) => handleSettingChange('privacy', 'profileVisibility', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Email Address</Label>
                          <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                        </div>
                        <Switch
                          checked={settings.privacy.showEmail}
                          onCheckedChange={(checked) => handleSettingChange('privacy', 'showEmail', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Phone Number</Label>
                          <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
                        </div>
                        <Switch
                          checked={settings.privacy.showPhone}
                          onCheckedChange={(checked) => handleSettingChange('privacy', 'showPhone', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Data Collection</Label>
                          <p className="text-sm text-muted-foreground">Allow collection of usage data for improvement</p>
                        </div>
                        <Switch
                          checked={settings.privacy.dataCollection}
                          onCheckedChange={(checked) => handleSettingChange('privacy', 'dataCollection', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Security & Account</span>
                  </CardTitle>
                  <CardDescription>Manage your account security and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => handleSettingChange('security', 'twoFactor', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Session Timeout</Label>
                      <Select
                        value={settings.security.sessionTimeout}
                        onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                      </div>
                      <Switch
                        checked={settings.security.loginAlerts}
                        onCheckedChange={(checked) => handleSettingChange('security', 'loginAlerts', checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Management</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Download className="h-4 w-4 text-blue-600" />
                          <div>
                            <Label>Export Data</Label>
                            <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                          </div>
                        </div>
                        <Button variant="outline" onClick={handleExportData}>
                          Export
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center space-x-3">
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <div>
                            <Label className="text-red-800">Delete Account</Label>
                            <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                          </div>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}