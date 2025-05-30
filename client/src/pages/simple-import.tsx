import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, Download } from 'lucide-react';
import { useLocation } from 'wouter';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

const SimpleImportPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  // Tezos wallet import states
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoadingNfts, setIsLoadingNfts] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNfts, setSelectedNfts] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [nftLimit, setNftLimit] = useState<number>(100);
  const [nftOffset, setNftOffset] = useState<number>(0);
  
  // Import result states
  const [importResult, setImportResult] = useState<{
    message: string;
    imported: number;
    skipped: number;
    isVisible: boolean;
  } | null>(null);

  const isAuthenticated = !!user;
  
  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  // Fetch NFTs from Tezos wallet
  const fetchTezosNfts = useCallback(async () => {
    if (!walletAddress || walletAddress.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please enter a valid Tezos wallet address',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoadingNfts(true);
    try {
      const response = await axios.get(
        `/api/nfts/tezos?address=${encodeURIComponent(walletAddress)}&limit=${nftLimit}&offset=${nftOffset}`
      );
      setNfts(response.data.nfts || []);
      
      // Reset selected NFTs when new ones are loaded
      setSelectedNfts({});
      setSelectAll(false);
      
      toast({
        title: 'NFTs Loaded',
        description: `Found ${response.data.nfts?.length || 0} NFTs from this wallet`,
      });
    } catch (error: any) {
      console.error('Failed to fetch Tezos NFTs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch NFTs from this wallet. Please check the address and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingNfts(false);
    }
  }, [walletAddress, nftLimit, nftOffset, toast]);

  // Import selected NFTs mutation
  const importMutation = useMutation({
    mutationFn: async () => {
      const selectedNftList = nfts.filter(nft => selectedNfts[nft.id]);
      
      const response = await apiRequest('POST', '/api/nfts/tezos/import', {
        nfts: selectedNftList,
        walletAddress: walletAddress
      });
      
      return response.json();
    },
    onSuccess: (result) => {
      setImportResult({
        message: result.message,
        imported: result.imported,
        skipped: result.skipped,
        isVisible: true
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${result.imported} NFTs`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Import Failed',
        description: error.message || 'Failed to import NFTs',
        variant: 'destructive',
      });
    }
  });

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelected: Record<string, boolean> = {};
    if (checked) {
      nfts.forEach(nft => {
        newSelected[nft.id] = true;
      });
    }
    setSelectedNfts(newSelected);
  };

  const handleSelectNft = (nftId: string, checked: boolean) => {
    setSelectedNfts(prev => ({
      ...prev,
      [nftId]: checked
    }));
  };

  const selectedCount = Object.values(selectedNfts).filter(Boolean).length;

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Import NFTs</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Import from Tezos Wallet</CardTitle>
            <CardDescription>
              Enter a Tezos wallet address to find and import NFTs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter Tezos wallet address (tz1...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={fetchTezosNfts}
                disabled={isLoadingNfts || !walletAddress.trim()}
              >
                {isLoadingNfts ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Fetch NFTs
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Limit</label>
                <Input
                  type="number"
                  value={nftLimit}
                  onChange={(e) => setNftLimit(parseInt(e.target.value) || 100)}
                  min="1"
                  max="1000"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Offset</label>
                <Input
                  type="number"
                  value={nftOffset}
                  onChange={(e) => setNftOffset(parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NFT Selection */}
        {nfts.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Select NFTs to Import ({nfts.length} found)</span>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm">
                    Select All
                  </label>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {nfts.map((nft) => (
                  <div key={nft.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`nft-${nft.id}`}
                        checked={selectedNfts[nft.id] || false}
                        onCheckedChange={(checked) => handleSelectNft(nft.id, checked as boolean)}
                      />
                      <label htmlFor={`nft-${nft.id}`} className="text-sm font-medium truncate">
                        {nft.name || 'Untitled'}
                      </label>
                    </div>
                    {nft.image && (
                      <img
                        src={nft.image}
                        alt={nft.name || 'NFT'}
                        className="w-full h-24 object-cover rounded"
                      />
                    )}
                    <p className="text-xs text-muted-foreground truncate">
                      {nft.description || 'No description'}
                    </p>
                  </div>
                ))}
              </div>
              
              {selectedCount > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={() => importMutation.mutate()}
                    disabled={importMutation.isPending}
                    className="w-full"
                  >
                    {importMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing {selectedCount} NFTs...
                      </>
                    ) : (
                      `Import Selected NFTs (${selectedCount})`
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Import Results */}
        {importResult?.isVisible && (
          <Card>
            <CardHeader>
              <CardTitle>Import Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600 font-medium">{importResult.message}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Imported: {importResult.imported}</p>
                <p>Skipped: {importResult.skipped}</p>
              </div>
              <Button
                onClick={() => navigate('/')}
                className="mt-4"
              >
                View Portfolio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default SimpleImportPage;