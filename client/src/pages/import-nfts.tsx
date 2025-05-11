import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import Layout from '@/components/layout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, ChevronRight, Check } from 'lucide-react';
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

const BLOCKCHAIN_OPTIONS = [
  { value: 'tezos', label: 'Tezos (XTZ)' },
  { value: 'ethereum', label: 'Ethereum (ETH) - Coming Soon', disabled: true },
  { value: 'solana', label: 'Solana (SOL) - Coming Soon', disabled: true },
];

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
  const [blockchain, setBlockchain] = useState<string>('tezos');
  const [address, setAddress] = useState<string>('');
  const [selectedNfts, setSelectedNfts] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);

  const isAuthenticated = !!user;

  // If not authenticated, redirect to auth page
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const { 
    data: nftsData,
    isLoading: isLoadingNfts,
    error: nftsError, 
    refetch: refetchNfts 
  } = useQuery({
    queryKey: ['/api/nfts/tezos', address],
    queryFn: async () => {
      if (!address) return { nfts: [] };
      const response = await apiRequest('GET', `/api/nfts/tezos?address=${address}`);
      return await response.json();
    },
    enabled: false, // Don't fetch automatically, only when triggered
  });

  const importMutation = useMutation({
    mutationFn: async ({ blockchain, address, selectedNftIds }: { 
      blockchain: string, 
      address: string, 
      selectedNftIds?: string[] 
    }) => {
      const response = await apiRequest('POST', `/api/nfts/${blockchain}/import`, {
        address,
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

  const handleFetchNFTs = async () => {
    if (!address) {
      toast({
        title: 'Error',
        description: 'Please enter a wallet address',
        variant: 'destructive',
      });
      return;
    }

    try {
      await refetchNfts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to fetch NFTs: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleImportNFTs = () => {
    const selectedNftIds = Object.entries(selectedNfts)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    importMutation.mutate({
      blockchain,
      address,
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
        <h1 className="text-3xl font-bold mb-6">Import NFTs from Blockchain</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Blockchain & Wallet</CardTitle>
            <CardDescription>
              Choose a blockchain and enter your wallet address to fetch your NFTs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blockchain">Blockchain</Label>
              <Select 
                value={blockchain} 
                onValueChange={setBlockchain}
              >
                <SelectTrigger id="blockchain">
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent>
                  {BLOCKCHAIN_OPTIONS.map(option => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  placeholder={
                    blockchain === 'tezos'
                      ? 'tz1...'
                      : blockchain === 'ethereum'
                      ? '0x...'
                      : 'Wallet address'
                  }
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={importMutation.isPending}
                />
                <Button 
                  onClick={handleFetchNFTs} 
                  disabled={!address || isLoadingNfts || importMutation.isPending}
                >
                  {isLoadingNfts ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Fetch NFTs'
                  )}
                </Button>
              </div>
            </div>
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