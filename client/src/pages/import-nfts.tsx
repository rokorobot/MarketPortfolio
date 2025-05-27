import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, ChevronRight, MinusCircle, PlusCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

const ImportNFTsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  
  // Tezos wallet import states
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isLoadingNfts, setIsLoadingNfts] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [selectedNfts, setSelectedNfts] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [nftLimit, setNftLimit] = useState<number>(500); // Default to 500 NFTs
  const [nftOffset, setNftOffset] = useState<number>(0); // Start from the beginning by default
  const [totalNfts, setTotalNfts] = useState<number>(0);
  
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
      setTotalNfts(response.data.total || 0);
      
      // Reset selected NFTs when new ones are loaded
      setSelectedNfts({});
      setSelectAll(false);
      
      // Show toast with the number of NFTs fetched
      toast({
        title: 'NFTs Loaded',
        description: `Found ${response.data.nfts?.length || 0} NFTs starting from #${nftOffset} (total: ${response.data.total}).`,
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

  const importMutation = useMutation({
    mutationFn: async ({ selectedNftIds }: { selectedNftIds?: string[] }) => {
      const response = await apiRequest('POST', '/api/nfts/tezos/import', {
        address: walletAddress,
        selectedNftIds,
        limit: nftLimit,
        offset: nftOffset
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // Display a more detailed result message
      const { imported, skipped, message } = data;
      
      // Show toast with detailed information
      toast({
        title: 'Import Results',
        description: message || `Imported ${imported || 0} NFTs${skipped ? `, skipped ${skipped} duplicates` : ''}`,
        duration: 5000, // Show for 5 seconds before redirecting
      });
      
      // Update the items list
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      
      // Set the import result to display on page
      setImportResult({
        message: message || `Successfully imported ${imported || 0} NFTs${skipped ? `, skipped ${skipped} duplicates` : ''}`,
        imported: imported || 0,
        skipped: skipped || 0,
        isVisible: true
      });
      
      // Delay navigation to home to give time to see the results
      setTimeout(() => {
        setImportResult(null); // Clear the result when navigating
        navigate('/');
      }, 4000); // A bit longer to ensure users see the message
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
    
    const newSelectedNfts = { ...selectedNfts };
    nfts.forEach((nft) => {
      newSelectedNfts[nft.id] = newSelectAll;
    });
    setSelectedNfts(newSelectedNfts);
  };

  const handleToggleNft = (id: string) => {
    setSelectedNfts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectedCount = Object.values(selectedNfts).filter(Boolean).length;

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Import NFTs from OBJKT</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Import from Tezos Wallet</CardTitle>
            <CardDescription>
              Enter a Tezos wallet address to find and import NFTs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <p>
                Enter a Tezos wallet address to fetch NFTs associated with that wallet.
                You can then select which ones to import into your portfolio.
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Tezos wallet address (tz...)"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-end gap-4">
                  <div className="w-1/3">
                    <label htmlFor="nft-offset" className="text-sm font-medium mb-1 block">
                      Start from NFT #
                    </label>
                    <div className="flex items-center w-full">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-r-none"
                        onClick={() => setNftOffset(Math.max(0, nftOffset - 100))}
                        disabled={nftOffset === 0}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Input
                        id="nft-offset"
                        type="number"
                        min="0"
                        step="100"
                        className="h-10 rounded-none text-center"
                        value={nftOffset}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val >= 0) {
                            setNftOffset(val);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-l-none"
                        onClick={() => setNftOffset(nftOffset + 100)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-1/3">
                    <label htmlFor="nft-limit" className="text-sm font-medium mb-1 block">
                      Maximum NFTs to fetch
                    </label>
                    <select 
                      id="nft-limit"
                      className="w-full h-10 px-3 py-2 bg-background text-foreground rounded-md border border-input"
                      value={nftLimit}
                      onChange={(e) => setNftLimit(parseInt(e.target.value, 10))}
                    >
                      <option value="50">50 NFTs</option>
                      <option value="100">100 NFTs</option>
                      <option value="200">200 NFTs</option>
                      <option value="300">300 NFTs</option>
                      <option value="500">500 NFTs</option>
                    </select>
                  </div>
                  <Button 
                    onClick={fetchTezosNfts} 
                    disabled={isLoadingNfts}
                  >
                    {isLoadingNfts ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      'Fetch NFTs'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoadingNfts && (
          <div className="flex flex-col justify-center items-center h-40 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-center">
              Loading NFTs from the Tezos blockchain...<br />
              <span className="text-sm text-muted-foreground">
                This may take a while for large collections (up to {nftLimit} NFTs).
              </span>
            </span>
          </div>
        )}

        {!isLoadingNfts && nfts.length > 0 && (
          <>
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-4">
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
                <span className="text-sm text-muted-foreground ml-2">
                  (Found {totalNfts} NFTs in total)
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-4 text-sm font-medium">
                  {selectedCount} of {nfts.length} selected
                </span>
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
                      Contract: {nft.contract?.substring(0, 8)}...{nft.contract?.substring(nft.contract?.length - 4)}
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

        {!isLoadingNfts && nfts.length === 0 && walletAddress && (
          <Card>
            <CardContent className="p-8 text-center">
              <p>No NFTs found for this wallet address.</p>
              <p className="text-muted-foreground mt-2">
                Please check the address and make sure it's correct.
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Import Results Card */}
        {importResult && importResult.isVisible && (
          <Card className="mt-8 border-2 border-primary animate-pulse">
            <CardHeader>
              <CardTitle className="text-center">Import Results</CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-xl font-medium">{importResult.message}</div>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-primary">{importResult.imported}</div>
                    <div className="text-sm text-muted-foreground">NFTs Imported</div>
                  </div>
                  
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-amber-500">{importResult.skipped}</div>
                    <div className="text-sm text-muted-foreground">Duplicates Skipped</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Redirecting to your portfolio in a moment...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ImportNFTsPage;