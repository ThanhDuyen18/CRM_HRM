import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Bell, Eye, Lock, Palette, Save } from "lucide-react";
import { UserRole } from "@/lib/auth";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>('staff');
  const [saving, setSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'system',
    notifications: JSON.parse(localStorage.getItem('notificationSettings') || '{"email": true, "push": true, "inApp": true}'),
    language: localStorage.getItem('language') || 'vi',
    autoLogout: localStorage.getItem('autoLogout') === 'true',
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate('/auth/login');
          return;
        }

        const userRole = await getUserRole(user.id);
        setRole(userRole);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        navigate('/auth/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleThemeChange = (value: string) => {
    setSettings(prev => ({ ...prev, theme: value }));
    localStorage.setItem('theme', value);
  };

  const handleLanguageChange = (value: string) => {
    setSettings(prev => ({ ...prev, language: value }));
    localStorage.setItem('language', value);
  };

  const handleNotificationToggle = (type: 'email' | 'push' | 'inApp') => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleAutoLogoutToggle = () => {
    setSettings(prev => ({ ...prev, autoLogout: !prev.autoLogout }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(settings.notifications));
      localStorage.setItem('autoLogout', settings.autoLogout ? 'true' : 'false');

      toast({
        title: "Thành công",
        description: "Cài đặt của bạn đã được lưu."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu cài đặt."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role={role}>
        <div className="p-6 text-center">Đang tải...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="space-y-8 pb-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Cài Đặt
          </h1>
          <p className="text-muted-foreground mt-2">Quản lý các tùy chọn và tính năng cá nhân của bạn</p>
        </div>

        {/* Display & Theme Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Hiển Thị & Giao Diện</CardTitle>
                <CardDescription>Tùy chỉnh giao diện ứng dụng</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-2">
              <Label htmlFor="theme-select">Chế độ Giao diện</Label>
              <Select value={settings.theme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Sáng (Light)</SelectItem>
                  <SelectItem value="dark">Tối (Dark)</SelectItem>
                  <SelectItem value="system">Theo Hệ Thống</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor="language-select">Ngôn Ngữ</Label>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger id="language-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Thông Báo</CardTitle>
                <CardDescription>Quản lý các thông báo và cảnh báo</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Thông báo qua Email</p>
                <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={() => handleNotificationToggle('email')}
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Thông báo Push</p>
                <p className="text-sm text-muted-foreground">Nhận thông báo trên trình duyệt</p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={() => handleNotificationToggle('push')}
              />
            </div>

            {/* In-App Notifications */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Thông báo Trong Ứng Dụng</p>
                <p className="text-sm text-muted-foreground">Nhận thông báo bên trong ứng dụng</p>
              </div>
              <Switch
                checked={settings.notifications.inApp}
                onCheckedChange={() => handleNotificationToggle('inApp')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Privacy Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>Bảo Mật & Riêng Tư</CardTitle>
                <CardDescription>Quản lý bảo mật tài khoản</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Auto Logout */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Tự Động Đăng Xuất</p>
                <p className="text-sm text-muted-foreground">Tự động đăng xuất sau 1 giờ không hoạt động</p>
              </div>
              <Switch
                checked={settings.autoLogout}
                onCheckedChange={handleAutoLogoutToggle}
              />
            </div>

            {/* Change Password */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/profile')}
            >
              <Eye className="mr-2 h-4 w-4" />
              Đổi Mật Khẩu
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Tài Khoản</CardTitle>
            <CardDescription>Thông tin tài khoản của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary/50 rounded-lg border">
              <p className="text-sm text-muted-foreground">Vai Trò</p>
              <p className="font-semibold capitalize">{role}</p>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/profile')}
            >
              Xem Hồ Sơ Cá Nhân
            </Button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Đang lưu...' : 'Lưu Cài Đặt'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
