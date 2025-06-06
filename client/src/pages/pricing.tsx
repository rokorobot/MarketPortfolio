import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, ArrowRight, Users, Database, Shield, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface PricingTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  period: string;
  description: string;
  popular?: boolean;
  features: string[];
  limits: {
    items: string;
    storage: string;
    collections: string;
    sharing: string;
    support: string;
  };
  ctaText: string;
  stripePrice?: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    icon: <Users className="w-6 h-6" />,
    price: 0,
    period: "forever",
    description: "Perfect for getting started with your NFT portfolio",
    features: [
      "Basic portfolio creation",
      "Public portfolio sharing",
      "Tezos blockchain integration",
      "Basic analytics",
      "Community support"
    ],
    limits: {
      items: "25 items",
      storage: "50 MB",
      collections: "3 collections",
      sharing: "Public links only",
      support: "Community forum"
    },
    ctaText: "Get Started Free"
  },
  {
    id: "basic",
    name: "Basic",
    icon: <Zap className="w-6 h-6" />,
    price: 9.99,
    period: "month",
    description: "For creators ready to showcase their work professionally",
    popular: true,
    features: [
      "Everything in Free",
      "Custom portfolio themes",
      "Advanced sharing options",
      "Portfolio analytics",
      "Priority email support",
      "Custom domain connection",
      "Remove platform branding"
    ],
    limits: {
      items: "100 items",
      storage: "300 MB",
      collections: "15 collections",
      sharing: "Private & password protected",
      support: "Email support (24h response)"
    },
    ctaText: "Upgrade to Basic",
    stripePrice: "price_basic_monthly"
  },
  {
    id: "professional",
    name: "Professional",
    icon: <Star className="w-6 h-6" />,
    price: 29.99,
    period: "month",
    description: "For serious collectors and professional artists",
    features: [
      "Everything in Basic",
      "Multi-blockchain support",
      "Advanced portfolio customization",
      "White-label solutions",
      "API access",
      "Bulk import tools",
      "Advanced analytics & insights",
      "Collaboration features",
      "Export capabilities"
    ],
    limits: {
      items: "1,000 items",
      storage: "5 GB",
      collections: "Unlimited",
      sharing: "Advanced privacy controls",
      support: "Priority support (4h response)"
    },
    ctaText: "Upgrade to Professional",
    stripePrice: "price_professional_monthly"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: <Crown className="w-6 h-6" />,
    price: 99.99,
    period: "month",
    description: "For galleries, institutions, and large-scale operations",
    features: [
      "Everything in Professional",
      "Unlimited everything",
      "Dedicated account manager",
      "Custom integrations",
      "On-premise deployment option",
      "Advanced security features",
      "Custom branding & themes",
      "Multi-user management",
      "SLA guarantee",
      "Training & onboarding"
    ],
    limits: {
      items: "Unlimited",
      storage: "Unlimited",
      collections: "Unlimited",
      sharing: "Enterprise-grade security",
      support: "Dedicated support (1h response)"
    },
    ctaText: "Contact Sales",
    stripePrice: "price_enterprise_monthly"
  }
];

export default function PricingPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (tier: PricingTier) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upgrade your subscription",
        variant: "destructive"
      });
      return;
    }

    if (tier.id === "free") {
      return;
    }

    if (tier.id === "enterprise") {
      // For enterprise, redirect to contact form or show contact info
      toast({
        title: "Enterprise Sales",
        description: "Our sales team will contact you within 24 hours to discuss your enterprise needs.",
      });
      return;
    }

    setIsUpgrading(tier.id);

    try {
      // Create Stripe checkout session
      const response = await apiRequest("POST", "/api/create-subscription", {
        priceId: tier.stripePrice,
        tierName: tier.name
      });

      const data = await response.json();
      
      if (data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast({
        title: "Upgrade Failed",
        description: "Unable to process upgrade. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsUpgrading(null);
    }
  };

  const getCurrentTier = () => {
    if (!user) return "free";
    return (user as any).subscriptionType || "free";
  };

  const currentTier = getCurrentTier();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-4">
            Pricing Plans
          </Badge>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          From free portfolios to enterprise solutions, find the perfect plan to showcase your NFT collection
        </p>
        
        {user && (
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            Currently on {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} plan
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card key={tier.id} className={`relative ${tier.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border shadow-lg'} transition-all hover:shadow-xl`}>
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${tier.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {tier.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-gray-500">/{tier.period}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Limits */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800">Limits</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span className="font-medium">{tier.limits.items}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span className="font-medium">{tier.limits.storage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collections:</span>
                      <span className="font-medium">{tier.limits.collections}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-gray-800">Features</h4>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                    Support
                  </h4>
                  <p className="text-sm text-gray-600">{tier.limits.support}</p>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => handleUpgrade(tier)}
                  disabled={isUpgrading === tier.id || currentTier === tier.id || isLoading}
                  className={`w-full ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''} group`}
                  variant={tier.popular ? "default" : "outline"}
                >
                  {isUpgrading === tier.id ? (
                    "Processing..."
                  ) : currentTier === tier.id ? (
                    "Current Plan"
                  ) : (
                    <>
                      {tier.ctaText}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about our pricing plans</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-semibold">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">What happens to my data if I downgrade?</h3>
              <p className="text-gray-600">Your data remains safe. If you exceed the new limits, you'll need to reduce items or upgrade again to add more.</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee on all paid plans if you're not completely satisfied.</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Is there a setup fee?</h3>
              <p className="text-gray-600">No setup fees ever. You only pay the monthly subscription fee for the plan you choose.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of creators showcasing their NFT collections</p>
          
          {!user ? (
            <div className="space-x-4">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Sign Up Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Demo
              </Button>
            </div>
          ) : (
            <Link href="/">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}