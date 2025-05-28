import { useState, useCallback } from 'react';
import { DAppClient, SigningType } from '@airgap/beacon-sdk';
import { useToast } from '@/hooks/use-toast';

interface WalletConnection {
  address: string;
  message: string;
  signature: string;
}

export function useTezosWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [client, setClient] = useState<DAppClient | null>(null);
  const { toast } = useToast();

  const connectWallet = useCallback(async (): Promise<WalletConnection | null> => {
    setIsConnecting(true);
    
    try {
      // Initialize DApp client
      const dAppClient = new DAppClient({ 
        name: "Portfolio Platform",
        description: "Import and showcase your NFT collections",
        iconUrl: "/favicon.svg"
      });
      setClient(dAppClient);

      // Step 1: Connect wallet and get permissions
      const permissions = await dAppClient.requestPermissions();
      const userAddress = permissions.address;

      // Step 2: Generate authentication message
      const timestamp = new Date().toISOString();
      const message = `Authenticate wallet for Portfolio Platform at ${timestamp}`;

      // Step 3: Request signature
      const result = await dAppClient.requestSignPayload({
        signingType: SigningType.RAW,
        payload: Buffer.from(message).toString("hex")
      });

      // Step 4: Prepare connection data
      const walletConnection: WalletConnection = {
        address: userAddress,
        message: message,
        signature: result.signature
      };

      setConnectedAddress(userAddress);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${userAddress.slice(0, 10)}...`,
        variant: "default"
      });

      return walletConnection;

    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });

      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [toast]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (client) {
        await client.destroy();
        setClient(null);
      }
      setConnectedAddress(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from wallet",
        variant: "default"
      });
    } catch (error: any) {
      console.error("Disconnect failed:", error);
    }
  }, [client, toast]);

  return {
    connectWallet,
    disconnectWallet,
    isConnecting,
    connectedAddress,
    isConnected: !!connectedAddress
  };
}