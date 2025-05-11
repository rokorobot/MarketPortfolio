import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, ChevronRight, ExternalLink, Check } from 'lucide-react';
import { useLocation } from 'wouter';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface NFT {
  id: string;
  name?: string;
  description?: string;
  image?: string;
  contract?: string;
  tokenId?: string;
  creator?: string;
  marketplace?: string;
  marketplaceUrl?: string;
}

const ImportNFTsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [authUrl, setAuthUrl] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [objktProfile, setObjktProfile] = useState<string>('');
  const [selectedNfts, setSelectedNfts] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);

  const isAuthenticated = !!user;

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  // Check for callback from OBJKT authentication
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const objktCode = params.get('objkt_code');
    
    if (objktCode) {
      // Clear the URL parameter without refreshing the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Process the auth code
      processObjktAuth(objktCode);
    }
  }, []);

  const processObjktAuth = async (code: string) => {
    setIsConnecting(true);
    try {
      // Exchange code for user data
      const response = await apiRequest('POST', '/api/nfts/objkt/auth', { code });
      const data = await response.json();
      
      if (data.success) {
        setIsConnected(true);
        setObjktProfile(data.profile);
        toast({
          title: 'Success',
          description: 'Successfully connected to your OBJKT account!',
        });
      } else {
        throw new Error(data.message || 'Failed to authenticate with OBJKT');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Authentication failed: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const { 
    data: nftsData,
    isLoading: isLoadingNfts,
    error: nftsError, 
    refetch: refetchNfts 
  } = useQuery({
    queryKey: ['/api/nfts/objkt', objktProfile],
    queryFn: async () => {
      if (!isConnected) return { nfts: [] };
      const response = await apiRequest('GET', '/api/nfts/objkt');
      return await response.json();
    },
    enabled: isConnected, // Only enabled when connected to OBJKT
  });

  const requestObjktAuth = async () => {
    try {
      setIsConnecting(true);
      // Get auth URL from our backend
      const response = await apiRequest('GET', '/api/nfts/objkt/auth-url');
      const data = await response.json();
      
      if (data.authUrl) {
        // Store the auth URL and open it in a new window
        setAuthUrl(data.authUrl);
        window.open(data.authUrl, '_blank', 'width=600,height=700');
        toast({
          title: 'OBJKT Authentication',
          description: 'Please sign in with your OBJKT account in the new window and authorize access.',
        });
      } else {
        throw new Error('Failed to generate authorization URL');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to start authentication: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const importMutation = useMutation({
    mutationFn: async ({ selectedNftIds }: { selectedNftIds?: string[] }) => {
      const response = await apiRequest('POST', '/api/nfts/objkt/import', {
        selectedNftIds
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'NFTs imported successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      navigate('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to import NFTs: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleImportNFTs = () => {
    const selectedNftIds = Object.entries(selectedNfts)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    importMutation.mutate({
      selectedNftIds: selectedNftIds.length > 0 ? selectedNftIds : undefined // If none selected, import all
    });
  };

  const handleToggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (nftsData?.nfts) {
      const newSelectedNfts = { ...selectedNfts };
      nftsData.nfts.forEach((nft: NFT) => {
        newSelectedNfts[nft.id] = newSelectAll;
      });
      setSelectedNfts(newSelectedNfts);
    }
  };

  const handleToggleNft = (id: string) => {
    setSelectedNfts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const nfts: NFT[] = nftsData?.nfts || [];
  const selectedCount = Object.values(selectedNfts).filter(Boolean).length;

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Import NFTs from OBJKT</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Connect with OBJKT</CardTitle>
            <CardDescription>
              Securely connect to your OBJKT account to import your NFTs with OAuth authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected ? (
              <div className="space-y-4">
                <p>
                  To import your NFTs, you'll need to connect to OBJKT using their secure
                  authentication system. This ensures that you're only importing NFTs that you own.
                </p>
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
                  <img 
                    src="https://objkt.com/assets/logo3.svg" 
                    alt="OBJKT Logo" 
                    className="mb-4 h-16" 
                  />
                  <Button 
                    onClick={requestObjktAuth} 
                    disabled={isConnecting}
                    className="gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        Connect to OBJKT
                        <ExternalLink className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 p-4 border rounded-lg bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Successfully connected to OBJKT</p>
                  <p className="text-sm opacity-80">Ready to import your NFTs</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {nftsError && (
          <div className="text-red-500 mb-4">
            Error: {(nftsError as Error).message}
          </div>
        )}

        {isLoadingNfts && (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading NFTs...</span>
          </div>
        )}

        {!isLoadingNfts && nfts.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all" 
                  checked={selectAll} 
                  onCheckedChange={handleToggleSelectAll} 
                />
                <label 
                  htmlFor="select-all" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select All NFTs
                </label>
              </div>
              <div>
                <span className="mr-4">{selectedCount} of {nfts.length} selected</span>
                <Button 
                  onClick={handleImportNFTs} 
                  disabled={importMutation.isPending}
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      Import Selected
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nfts.map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox 
                        checked={selectedNfts[nft.id] || false} 
                        onCheckedChange={() => handleToggleNft(nft.id)}
                      />
                    </div>
                    {nft.image ? (
                      <img 
                        src={nft.image} 
                        alt={nft.name || 'NFT'} 
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold truncate">{nft.name || 'Untitled NFT'}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      Contract: {nft.contract?.substring(0, 8)}...{nft.contract?.substring(nft.contract.length - 4)}
                    </p>
                    <p className="text-xs text-muted-foreground">Token ID: {nft.tokenId}</p>
                    {nft.creator && (
                      <p className="text-xs text-muted-foreground">Creator: {nft.creator}</p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    {nft.marketplaceUrl && (
                      <a 
                        href={nft.marketplaceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View on {nft.marketplace || 'Marketplace'} →
                      </a>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}

        {!isLoadingNfts && nfts.length === 0 && address && (
          <Card>
            <CardContent className="p-8 text-center">
              <p>No NFTs found for this wallet address.</p>
              <p className="text-muted-foreground mt-2">
                Please check the address and make sure it's correct for the selected blockchain.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ImportNFTsPage;