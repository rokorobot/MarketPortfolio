import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  Database, 
  AlertTriangle, 
  TrendingUp, 
  Settings,
  Crown,
  Zap,
  Star
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QuotaStats {
  totalUsers: number;
  freeUsers: number;
  paidUsers: number;
  usersAtItemLimit: number;
  usersAtStorageLimit: number;
  averageItemsPerUser: number;
  averageStoragePerUserMB: number;
}

interface UserQuota {
  userId: number;
  username: string;
  subscriptionType: string;
  maxItems: number | null;
  maxStorageMB: number | null;
  currentItems: number;
  currentStorageUsedMB: number;
  itemsRemaining: number | null;
  storageRemainingMB: number | null;
  isAtItemLimit: boolean;
  isAtStorageLimit: boolean;
  canUpload: boolean;
}

export function QuotaDashboard() {
  const [stats, setStats] = useState<QuotaStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [editingQuota, setEditingQuota] = useState(false);
  const [quotaForm, setQuotaForm] = useState({
    maxItems: "",
    maxStorageMB: "",
    subscriptionType: "free"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotaStats();
    fetchUsers();
  }, []);

  const fetchQuotaStats = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/quota-stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching quota stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch quota statistics",
        variant: "destructive"
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    }
  };

  const handleEditQuota = (user: any) => {
    setSelectedUser(user);
    setQuotaForm({
      maxItems: user.maxItems?.toString() || "",
      maxStorageMB: user.maxStorageMB?.toString() || "",
      subscriptionType: user.subscriptionType || "free"
    });
    setEditingQuota(true);
  };

  const handleSaveQuota = async () => {
    if (!selectedUser) return;

    try {
      const maxItems = quotaForm.maxItems ? parseInt(quotaForm.maxItems) : null;
      const maxStorageMB = quotaForm.maxStorageMB ? parseInt(quotaForm.maxStorageMB) : null;

      await apiRequest("POST", "/api/admin/set-quota", {
        userId: selectedUser.id,
        maxItems,
        maxStorageMB,
        subscriptionType: quotaForm.subscriptionType
      });

      toast({
        title: "Success",
        description: "User quota updated successfully"
      });

      setEditingQuota(false);
      fetchUsers();
      fetchQuotaStats();
    } catch (error) {
      console.error("Error updating quota:", error);
      toast({
        title: "Error",
        description: "Failed to update user quota",
        variant: "destructive"
      });
    }
  };

  const getSubscriptionIcon = (type: string) => {
    switch (type) {
      case "unlimited":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "paid":
        return <Star className="w-4 h-4 text-blue-500" />;
      default:
        return <Zap className="w-4 h-4 text-gray-500" />;
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 75) return "text-yellow-500";
    return "text-green-500";
  };

  if (!stats) {
    return <div>Loading quota dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Quota Management</h2>
        <Button onClick={() => { fetchQuotaStats(); fetchUsers(); }}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.freeUsers} free, {stats.paidUsers} paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Items/User</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageItemsPerUser}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio items per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageStoragePerUserMB}MB</div>
            <p className="text-xs text-muted-foreground">
              Average per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Limits</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.usersAtItemLimit + stats.usersAtStorageLimit}
            </div>
            <p className="text-xs text-muted-foreground">
              Users needing upgrades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Quota Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const itemUsage = user.maxItems 
                ? Math.round((user.currentItems / user.maxItems) * 100)
                : 0;
              const storageUsage = user.maxStorageMB 
                ? Math.round((user.currentStorageUsedMB / user.maxStorageMB) * 100)
                : 0;

              return (
                <div key={user.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSubscriptionIcon(user.subscriptionType)}
                      <span className="font-medium">{user.username}</span>
                      <Badge variant={user.subscriptionType === 'free' ? 'secondary' : 'default'}>
                        {user.subscriptionType}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuota(user)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Edit Quota
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Items</span>
                        <span className={getUsageColor(itemUsage)}>
                          {user.currentItems} / {user.maxItems || "∞"}
                        </span>
                      </div>
                      <Progress 
                        value={user.maxItems ? itemUsage : 0} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage</span>
                        <span className={getUsageColor(storageUsage)}>
                          {user.currentStorageUsedMB}MB / {user.maxStorageMB || "∞"}MB
                        </span>
                      </div>
                      <Progress 
                        value={user.maxStorageMB ? storageUsage : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Quota Dialog */}
      <Dialog open={editingQuota} onOpenChange={setEditingQuota}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Quota</DialogTitle>
            <DialogDescription>
              Update quota limits for {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subscriptionType">Subscription Type</Label>
              <Select
                value={quotaForm.subscriptionType}
                onValueChange={(value) => setQuotaForm(prev => ({ ...prev, subscriptionType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maxItems">Max Items (leave empty for unlimited)</Label>
              <Input
                id="maxItems"
                type="number"
                value={quotaForm.maxItems}
                onChange={(e) => setQuotaForm(prev => ({ ...prev, maxItems: e.target.value }))}
                placeholder="e.g. 100"
              />
            </div>

            <div>
              <Label htmlFor="maxStorageMB">Max Storage (MB, leave empty for unlimited)</Label>
              <Input
                id="maxStorageMB"
                type="number"
                value={quotaForm.maxStorageMB}
                onChange={(e) => setQuotaForm(prev => ({ ...prev, maxStorageMB: e.target.value }))}
                placeholder="e.g. 500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingQuota(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuota}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}