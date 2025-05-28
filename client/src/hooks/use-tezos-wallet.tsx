import { useState, useCallback, useRef } from 'react';
import { DAppClient, SigningType } from '@airgap/beacon-sdk';
import { useToast } from '@/hooks/use-toast';

interface WalletConnection {
  address: string;
  message: string;
  signature: string;
}

// Global client instance to prevent multiple instances
let globalClient: DAppClient | null = null;

export function useTezosWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const clientRef = useRef<DAppClient | null>(null);
  const { toast } = useToast();

  const getOrCreateClient = useCallback(async (): Promise<DAppClient> => {
    if (globalClient) {
      clientRef.current = globalClient;
      return globalClient;
    }

    const client = new DAppClient({ 
      name: "Portfolio Platform",
      description: "Import and showcase your NFT collections",
      iconUrl: window.location.origin + "/favicon.svg"
    });

    globalClient = client;
    clientRef.current = client;
    return client;
  }, []);

  const connectWallet = useCallback(async (): Promise<WalletConnection | null> => {
    setIsConnecting(true);
    
    try {
      // Get or create singleton client
      const dAppClient = await getOrCreateClient();

      // Check if already connected
      const activeAccount = await dAppClient.getActiveAccount();
      if (activeAccount) {
        setConnectedAddress(activeAccount.address);
        
        toast({
          title: "Already Connected",
          description: `Using existing connection to ${activeAccount.address.slice(0, 10)}...`,
          variant: "default"
        });

        // Still create a signature for authentication
        const timestamp = new Date().toISOString();
        const message = `Authenticate wallet for Portfolio Platform at ${timestamp}`;

        const result = await dAppClient.requestSignPayload({
          signingType: SigningType.RAW,
          payload: Buffer.from(message).toString("hex")
        });

        return {
          address: activeAccount.address,
          message: message,
          signature: result.signature
        };
      }

      // Step 1: Request new connection
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
      
      let errorMessage = "Failed to connect wallet. Please try again.";
      if (error.errorType === "NOT_GRANTED_ERROR") {
        errorMessage = "Connection was cancelled. Please try again and approve the connection.";
      } else if (error.errorType === "UNKNOWN_ERROR") {
        errorMessage = "Wallet connection failed. Make sure you have a Tezos wallet installed.";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive"
      });

      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [getOrCreateClient, toast]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (clientRef.current) {
        await clientRef.current.clearActiveAccount();
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
  }, [toast]);

  return {
    connectWallet,
    disconnectWallet,
    isConnecting,
    connectedAddress,
    isConnected: !!connectedAddress
  };
}