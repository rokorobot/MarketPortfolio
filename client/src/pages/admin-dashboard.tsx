import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Users, HardDrive, TrendingUp, Settings, Crown, Palette } from "lucide-react";

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
}

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard/stats'],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and user management
          </p>
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
              Across all collections
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
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_users_30d || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="storage">Storage Analysis</TabsTrigger>
          <TabsTrigger value="settings">Platform Settings</TabsTrigger>
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