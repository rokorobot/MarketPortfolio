import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { ArrowLeft, Upload, Eye, Heart, TrendingUp, Grid, Users, HardDrive, Package, AlertTriangle } from "lucide-react";
import { type PortfolioItem } from "@shared/schema";

interface CreatorStats {
  total_items: number;
  total_views: number;
  total_favorites: number;
  items_this_month: number;
  avg_views_per_item: number;
  top_performing_items: Array<{
    id: number;
    title: string;
    views: number;
    favorites: number;
  }>;
  collections_breakdown: Array<{
    collection: string;
    items_count: number;
    total_views: number;
  }>;
  monthly_activity: Array<{
    month: string;
    uploads: number;
    views: number;
  }>;
}

interface UserQuotaInfo {
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

export default function CreatorDashboard() {
  const [location, navigate] = useLocation();

  // Fetch creator-specific stats
  const { data: stats, isLoading: statsLoading } = useQuery<CreatorStats>({
    queryKey: ['/api/creator/stats'],
  });

  // Fetch creator's items
  const { data: items, isLoading: itemsLoading } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/creator/items'],
  });

  // Fetch user quota information
  const { data: quotaInfo, isLoading: quotaLoading } = useQuery<UserQuotaInfo>({
    queryKey: ['/api/user/quota'],
  });

  if (statsLoading) {
    return <CreatorDashboardSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
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
            <h1 className="text-3xl font-bold tracking-tight">Creator Dashboard</h1>
            <p className="text-muted-foreground">
              Your content performance and analytics
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Creator Access</span>
        </div>
      </div>

      {/* Quota Usage Section */}
      {quotaInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Subscription Usage</span>
              <span className="text-sm font-normal text-muted-foreground">
                ({quotaInfo.subscriptionType.charAt(0).toUpperCase() + quotaInfo.subscriptionType.slice(1)} Plan)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Items Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Grid className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Items Used</span>
                  {quotaInfo.maxItems !== null && quotaInfo.currentItems / quotaInfo.maxItems >= 0.85 && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {quotaInfo.currentItems} / {quotaInfo.maxItems === null ? '∞' : quotaInfo.maxItems}
                </span>
              </div>
              <Progress 
                value={quotaInfo.maxItems === null ? 0 : (quotaInfo.currentItems / quotaInfo.maxItems) * 100} 
                className={`h-3 ${
                  quotaInfo.maxItems !== null && quotaInfo.currentItems / quotaInfo.maxItems >= 0.85 
                    ? '[&>[data-testid="progress-indicator"]]:bg-red-500' 
                    : ''
                }`}
              />
              {quotaInfo.maxItems !== null && (
                <p className="text-xs text-muted-foreground">
                  {quotaInfo.itemsRemaining} items remaining
                  {quotaInfo.currentItems / quotaInfo.maxItems >= 0.85 && (
                    <span className="text-red-500 ml-1 font-medium">- Near limit!</span>
                  )}
                </p>
              )}
            </div>

            {/* Storage Usage */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Storage Used</span>
                  {quotaInfo.maxStorageMB !== null && quotaInfo.currentStorageUsedMB / quotaInfo.maxStorageMB >= 0.85 && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {quotaInfo.currentStorageUsedMB.toFixed(1)} MB / {quotaInfo.maxStorageMB === null ? '∞' : quotaInfo.maxStorageMB + ' MB'}
                </span>
              </div>
              <Progress 
                value={quotaInfo.maxStorageMB === null ? 0 : (quotaInfo.currentStorageUsedMB / quotaInfo.maxStorageMB) * 100} 
                className={`h-3 ${
                  quotaInfo.maxStorageMB !== null && quotaInfo.currentStorageUsedMB / quotaInfo.maxStorageMB >= 0.85 
                    ? '[&>[data-testid="progress-indicator"]]:bg-red-500' 
                    : ''
                }`}
              />
              {quotaInfo.maxStorageMB !== null && (
                <p className="text-xs text-muted-foreground">
                  {quotaInfo.storageRemainingMB?.toFixed(1)} MB remaining
                  {quotaInfo.currentStorageUsedMB / quotaInfo.maxStorageMB >= 0.85 && (
                    <span className="text-red-500 ml-1 font-medium">- Near limit!</span>
                  )}
                </p>
              )}
            </div>

            {/* Upgrade suggestion if near limits */}
            {quotaInfo.maxItems !== null && quotaInfo.maxStorageMB !== null && 
             (quotaInfo.currentItems / quotaInfo.maxItems >= 0.85 || quotaInfo.currentStorageUsedMB / quotaInfo.maxStorageMB >= 0.85) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Approaching Limits</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Consider upgrading your plan to avoid interruptions to your workflow.
                </p>
                <Button 
                  size="sm" 
                  className="mt-2" 
                  onClick={() => navigate('/pricing')}
                >
                  View Plans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Grid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_items || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.items_this_month || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_views || 0}</div>
            <p className="text-xs text-muted-foreground">
              Avg {stats?.avg_views_per_item || 0} per item
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_favorites || 0}</div>
            <p className="text-xs text-muted-foreground">
              Liked by collectors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_items && stats?.total_views 
                ? Math.round((stats.total_views / stats.total_items) * 100) / 100
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Views per item ratio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.top_performing_items?.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{item.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{item.favorites}</span>
                    </span>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground text-center py-4">
                No performance data available yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Collections Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Collections Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.collections_breakdown?.map((collection) => (
              <div key={collection.collection} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{collection.collection}</p>
                  <p className="text-sm text-muted-foreground">
                    {collection.items_count} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{collection.total_views}</p>
                  <p className="text-xs text-muted-foreground">total views</p>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground text-center py-4">
                No collections data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Items */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items?.slice(0, 6).map((item) => (
              <div key={item.id} className="border rounded-lg p-3 space-y-2">
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/200x200/gray/white?text=Image";
                    }}
                  />
                </div>
                <div>
                  <p className="font-medium text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.category || "No collection"}
                  </p>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground text-center py-4 col-span-full">
                No items found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CreatorDashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}