import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, HardDrive, TrendingUp, Settings, Crown, Palette, Activity, Shield, 
  DollarSign, Globe, Server, Database, ChevronDown, ChevronRight, AlertTriangle,
  Eye, Upload, Clock, FileImage, Zap, Lock, Calendar, BarChart3, ArrowLeft, Save,
  Download, CheckCircle, XCircle, RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  display_name?: string;
  is_active: boolean;
  created_at: string;
  item_count: number;
  storage_used_mb: number;
  subscription_type: 'free' | 'paid';
}

interface DashboardStats {
  total_users: number;
  total_items: number;
  total_storage_used_gb: number;
  total_storage_limit_gb: number;
  active_users_30d: number;
  new_users_7d: number;
  daily_active_users: number;
  weekly_active_users: number;
  total_portfolio_views: number;
  uploads_this_week: number;
  avg_response_time_ms: number;
  error_rate_percent: number;
  uptime_percent: number;
  failed_logins_24h: number;
  revenue_monthly: number;
  conversion_rate_percent: number;
}

interface ActivityMetrics {
  upload_frequency: {
    today: number;
    this_week: number;
    this_month: number;
  };
  popular_collections: Array<{
    name: string;
    views: number;
    items: number;
  }>;
  file_types_distribution: Array<{
    type: string;
    count: number;
    total_size_mb: number;
  }>;
}

interface SecurityMetrics {
  failed_login_attempts: Array<{
    username: string;
    attempts: number;
    last_attempt: string;
    ip_address: string;
  }>;
  unverified_emails: number;
  weak_passwords: number;
  suspicious_activity: Array<{
    type: string;
    user: string;
    timestamp: string;
    details: string;
  }>;
}

interface SystemHealth {
  database_size_gb: number;
  backup_status: {
    last_backup: string;
    status: 'success' | 'failed' | 'in_progress';
    next_backup: string;
  };
  server_metrics: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
  };
  api_performance: Array<{
    endpoint: string;
    avg_response_ms: number;
    requests_count: number;
    error_rate: number;
  }>;
}

export default function AdminDashboard() {
  const [location, navigate] = useLocation();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [itemLimit, setItemLimit] = useState("");
  const [storageLimit, setStorageLimit] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard/stats'],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const { data: activityMetrics, isLoading: activityLoading } = useQuery<ActivityMetrics>({
    queryKey: ['/api/admin/activity-metrics'],
  });

  const { data: securityMetrics, isLoading: securityLoading } = useQuery<SecurityMetrics>({
    queryKey: ['/api/admin/security-metrics'],
  });

  const { data: systemHealth, isLoading: systemLoading } = useQuery<SystemHealth>({
    queryKey: ['/api/admin/system-health'],
  });

  const { data: siteSettings } = useQuery({
    queryKey: ['/api/site-settings'],
  });

  const { toast } = useToast();

  const updateLimitsMutation = useMutation({
    mutationFn: async (data: { free_user_item_limit: string; free_user_storage_limit_mb: string }) => {
      const res = await apiRequest('POST', '/api/site-settings', data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Free user limits have been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/site-settings'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Load current settings into form when data is available
  useEffect(() => {
    if (siteSettings) {
      setItemLimit(siteSettings.free_user_item_limit || "50");
      setStorageLimit(siteSettings.free_user_storage_limit_mb || "50");
    }
  }, [siteSettings]);

  const handleSaveLimits = () => {
    updateLimitsMutation.mutate({
      free_user_item_limit: itemLimit,
      free_user_storage_limit_mb: storageLimit,
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'creator': return <Palette className="h-4 w-4 text-blue-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'superadmin': return 'default';
      case 'creator': return 'secondary';
      case 'guest': return 'outline';
      default: return 'outline';
    }
  };

  // Image synchronization component
  function ImageSyncControls() {
    const [syncStatus, setSyncStatus] = useState<'idle' | 'uploading' | 'downloading' | 'success' | 'error'>('idle');
    const [syncMessage, setSyncMessage] = useState('');
    const { toast } = useToast();

    const uploadImagesMutation = useMutation({
      mutationFn: async () => {
        const response = await apiRequest('POST', '/api/images/upload-to-database');
        return response.json();
      },
      onSuccess: (data) => {
        setSyncStatus('success');
        setSyncMessage(`Successfully uploaded ${data.uploaded || 0} images to database`);
        toast({
          title: "Upload Complete",
          description: `${data.uploaded || 0} images uploaded to shared database`,
        });
      },
      onError: (error: Error) => {
        setSyncStatus('error');
        setSyncMessage(`Upload failed: ${error.message}`);
        toast({
          title: "Upload Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const downloadImagesMutation = useMutation({
      mutationFn: async () => {
        const response = await apiRequest('POST', '/api/images/download-from-database');
        return response.json();
      },
      onSuccess: (data) => {
        setSyncStatus('success');
        setSyncMessage(`Successfully downloaded ${data.downloaded || 0} images from database`);
        toast({
          title: "Download Complete", 
          description: `${data.downloaded || 0} images downloaded from shared database`,
        });
      },
      onError: (error: Error) => {
        setSyncStatus('error');
        setSyncMessage(`Download failed: ${error.message}`);
        toast({
          title: "Download Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const handleUploadImages = () => {
      setSyncStatus('uploading');
      setSyncMessage('Uploading images to shared database...');
      uploadImagesMutation.mutate();
    };

    const handleDownloadImages = () => {
      setSyncStatus('downloading');
      setSyncMessage('Downloading images from shared database...');
      downloadImagesMutation.mutate();
    };

    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
          <h3 className="font-medium mb-2">Image Synchronization Status</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Use this on Render to upload missing author images to the shared database, 
            then use this on Replit to download them.
          </p>
          
          {syncMessage && (
            <div className={`flex items-center space-x-2 p-2 rounded ${
              syncStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              syncStatus === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {syncStatus === 'success' && <CheckCircle className="h-4 w-4" />}
              {syncStatus === 'error' && <XCircle className="h-4 w-4" />}
              {(syncStatus === 'uploading' || syncStatus === 'downloading') && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span className="text-sm">{syncMessage}</span>
            </div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Button
            onClick={handleUploadImages}
            disabled={uploadImagesMutation.isPending || downloadImagesMutation.isPending}
            className="flex items-center space-x-2"
          >
            {uploadImagesMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>Upload Images to Database</span>
          </Button>

          <Button
            onClick={handleDownloadImages}
            disabled={uploadImagesMutation.isPending || downloadImagesMutation.isPending}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {downloadImagesMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>Download Images from Database</span>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Step 1:</strong> Run "Upload Images to Database" on Render deployment (where images exist)</p>
          <p><strong>Step 2:</strong> Run "Download Images from Database" on Replit deployment (where images are missing)</p>
        </div>
      </div>
    );
  }

  if (statsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Portfolio</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Platform overview and user management
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium">Super Admin Access</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.new_users_7d || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_items || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.uploads_this_week || 0} uploads this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_storage_used_gb?.toFixed(1) || 0} GB
            </div>
            <Progress 
              value={(stats?.total_storage_used_gb || 0) / (stats?.total_storage_limit_gb || 100) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              of {stats?.total_storage_limit_gb || 100} GB limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.uptime_percent?.toFixed(1) || 99.9}%</div>
            <p className="text-xs text-muted-foreground">
              {stats?.avg_response_time_ms || 120}ms avg response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats?.daily_active_users || 0}</div>
            <p className="text-xs text-muted-foreground">users today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats?.total_portfolio_views || 0}</div>
            <p className="text-xs text-muted-foreground">total views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">${stats?.revenue_monthly || 0}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats?.error_rate_percent?.toFixed(2) || 0.01}%</div>
            <p className="text-xs text-muted-foreground">last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats?.conversion_rate_percent?.toFixed(1) || 12.5}%</div>
            <p className="text-xs text-muted-foreground">free to paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts, roles, and subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <div>
                            <div>{user.display_name || user.username}</div>
                            <div className="text-sm text-muted-foreground">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.item_count}</TableCell>
                      <TableCell>{formatBytes(user.storage_used_mb * 1024 * 1024)}</TableCell>
                      <TableCell>
                        <Badge variant={user.subscription_type === 'paid' ? 'default' : 'secondary'}>
                          {user.subscription_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? 'default' : 'destructive'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Today:</span>
                    <span className="font-medium">{activityMetrics?.upload_frequency.today || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Week:</span>
                    <span className="font-medium">{activityMetrics?.upload_frequency.this_week || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Month:</span>
                    <span className="font-medium">{activityMetrics?.upload_frequency.this_month || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Popular Collections</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityMetrics?.popular_collections?.slice(0, 5).map((collection, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{collection.name}</div>
                        <div className="text-xs text-muted-foreground">{collection.items} items</div>
                      </div>
                      <Badge variant="secondary">{collection.views} views</Badge>
                    </div>
                  )) || (
                    <div className="text-sm text-muted-foreground">Loading collection data...</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileImage className="h-4 w-4" />
                  <span>File Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityMetrics?.file_types_distribution?.map((fileType, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{fileType.type.toUpperCase()}</span>
                        <span>{fileType.count} files</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatBytes(fileType.total_size_mb * 1024 * 1024)}
                      </div>
                      <Progress value={(fileType.count / (activityMetrics?.file_types_distribution?.reduce((sum, ft) => sum + ft.count, 0) || 1)) * 100} className="h-1" />
                    </div>
                  )) || (
                    <div className="text-sm text-muted-foreground">Loading file type data...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>User Activity Trends</span>
              </CardTitle>
              <CardDescription>
                Daily and weekly active user patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Weekly Active Users</div>
                  <div className="text-2xl font-bold">{stats?.weekly_active_users || 0}</div>
                  <div className="text-xs text-muted-foreground">
                    {((stats?.weekly_active_users || 0) / (stats?.total_users || 1) * 100).toFixed(1)}% of total users
                  </div>
                  <Progress value={(stats?.weekly_active_users || 0) / (stats?.total_users || 1) * 100} />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Daily Active Users</div>
                  <div className="text-2xl font-bold">{stats?.daily_active_users || 0}</div>
                  <div className="text-xs text-muted-foreground">
                    {((stats?.daily_active_users || 0) / (stats?.weekly_active_users || 1) * 100).toFixed(1)}% of weekly active
                  </div>
                  <Progress value={(stats?.daily_active_users || 0) / (stats?.weekly_active_users || 1) * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Security Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Failed Logins (24h)</span>
                    </div>
                    <Badge variant={stats?.failed_logins_24h && stats.failed_logins_24h > 10 ? "destructive" : "secondary"}>
                      {stats?.failed_logins_24h || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Unverified Emails</span>
                    </div>
                    <Badge variant="outline">
                      {securityMetrics?.unverified_emails || 0}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Weak Passwords</span>
                    </div>
                    <Badge variant="outline">
                      {securityMetrics?.weak_passwords || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Recent Security Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityMetrics?.suspicious_activity?.slice(0, 5).map((activity, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-1">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">{activity.type}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">User: {activity.user}</div>
                      <div className="text-xs">{activity.details}</div>
                    </div>
                  )) || (
                    <div className="text-sm text-muted-foreground">No recent security events</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Failed Login Attempts</CardTitle>
              <CardDescription>Recent failed authentication attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Last Attempt</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityMetrics?.failed_login_attempts?.map((attempt, index) => (
                    <TableRow key={index}>
                      <TableCell>{attempt.username}</TableCell>
                      <TableCell>
                        <Badge variant={attempt.attempts > 5 ? "destructive" : "secondary"}>
                          {attempt.attempts}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(attempt.last_attempt).toLocaleString()}</TableCell>
                      <TableCell>{attempt.ip_address}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Block IP
                        </Button>
                      </TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No failed login attempts
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-4 w-4" />
                  <span>Server Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{systemHealth?.server_metrics.cpu_usage || 0}%</span>
                    </div>
                    <Progress value={systemHealth?.server_metrics.cpu_usage || 0} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>{systemHealth?.server_metrics.memory_usage || 0}%</span>
                    </div>
                    <Progress value={systemHealth?.server_metrics.memory_usage || 0} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Disk Usage</span>
                      <span>{systemHealth?.server_metrics.disk_usage || 0}%</span>
                    </div>
                    <Progress value={systemHealth?.server_metrics.disk_usage || 0} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Database Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Database Size:</span>
                    <span className="font-medium">{systemHealth?.database_size_gb?.toFixed(2) || 0} GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Backup:</span>
                    <span className="font-medium">
                      {systemHealth?.backup_status.last_backup ? 
                        new Date(systemHealth.backup_status.last_backup).toLocaleDateString() : 
                        'Never'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Backup Status:</span>
                    <Badge variant={
                      systemHealth?.backup_status.status === 'success' ? 'default' :
                      systemHealth?.backup_status.status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {systemHealth?.backup_status.status || 'unknown'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Uptime:</span>
                    <span className="font-medium">{stats?.uptime_percent?.toFixed(2) || 99.9}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Response:</span>
                    <span className="font-medium">{stats?.avg_response_time_ms || 120}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Error Rate:</span>
                    <span className="font-medium">{stats?.error_rate_percent?.toFixed(3) || 0.001}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Performance</CardTitle>
              <CardDescription>Response times and error rates by endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Avg Response Time</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemHealth?.api_performance?.map((endpoint, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{endpoint.endpoint}</TableCell>
                      <TableCell>{endpoint.avg_response_ms}ms</TableCell>
                      <TableCell>{endpoint.requests_count.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={endpoint.error_rate > 5 ? "destructive" : endpoint.error_rate > 1 ? "secondary" : "default"}>
                          {endpoint.error_rate.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={endpoint.avg_response_ms < 200 ? "default" : endpoint.avg_response_ms < 500 ? "secondary" : "destructive"}>
                          {endpoint.avg_response_ms < 200 ? "Good" : endpoint.avg_response_ms < 500 ? "Fair" : "Slow"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Loading API performance data...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Storage Distribution</CardTitle>
                <CardDescription>
                  Storage usage by user type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm">{user.username}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatBytes(user.storage_used_mb * 1024 * 1024)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.item_count} items
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Limits</CardTitle>
                <CardDescription>
                  Current usage vs. limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total Used</span>
                      <span>{stats?.total_storage_used_gb?.toFixed(1)} GB</span>
                    </div>
                    <Progress value={(stats?.total_storage_used_gb || 0) / (stats?.total_storage_limit_gb || 100) * 100} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Limit: {stats?.total_storage_limit_gb} GB
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Storage Limits</span>
                </CardTitle>
                <CardDescription>
                  Configure storage limits for free users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="item-limit">Free User Item Limit</Label>
                    <div className="flex gap-2">
                      <Input
                        id="item-limit"
                        type="number"
                        value={itemLimit}
                        onChange={(e) => setItemLimit(e.target.value)}
                        placeholder="50"
                        className="w-32"
                      />
                      <span className="flex items-center text-sm text-muted-foreground">items</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="storage-limit">Free User Storage Limit</Label>
                    <div className="flex gap-2">
                      <Input
                        id="storage-limit"
                        type="number"
                        value={storageLimit}
                        onChange={(e) => setStorageLimit(e.target.value)}
                        placeholder="50"
                        className="w-32"
                      />
                      <span className="flex items-center text-sm text-muted-foreground">MB</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-fit"
                    onClick={handleSaveLimits}
                    disabled={updateLimitsMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateLimitsMutation.isPending ? "Saving..." : "Update Limits"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileImage className="h-4 w-4" />
                  <span>Image Synchronization</span>
                </CardTitle>
                <CardDescription>
                  Upload missing images from Render deployment to shared database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageSyncControls />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure platform-wide settings and limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Default Storage Limit</div>
                    <div className="text-sm text-muted-foreground">
                      Storage limit for new users
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">User Registration</div>
                    <div className="text-sm text-muted-foreground">
                      Control who can create accounts
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Settings</div>
                    <div className="text-sm text-muted-foreground">
                      Configure email notifications
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}