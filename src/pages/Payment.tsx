
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Calendar, Lock, Loader2, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const { user, updateUserPlan } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  
  // Get plan from URL params
  const queryParams = new URLSearchParams(location.search);
  const planId = queryParams.get('plan') || 'basic';
  const billingCycle = queryParams.get('billing') || 'monthly';
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=pricing');
    }
  }, [user, navigate]);

  // Plan details
  const planDetails = {
    basic: {
      name: 'Basic',
      monthlyPrice: 9.99,
      annualPrice: 7.99 * 12,
      features: ['50 credits/month', 'All writing styles', 'Enhanced humanization'],
    },
    pro: {
      name: 'Pro',
      monthlyPrice: 19.99,
      annualPrice: 16.99 * 12,
      features: ['150 credits/month', 'All writing styles', 'Premium humanization', 'Priority support'],
    },
    enterprise: {
      name: 'Enterprise',
      monthlyPrice: 49.99,
      annualPrice: 39.99 * 12,
      features: ['500 credits/month', 'All writing styles', 'Maximum humanization', '24/7 priority support'],
    }
  };
  
  const selectedPlan = planDetails[planId as keyof typeof planDetails] || planDetails.basic;
  const price = billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.annualPrice;
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length < 3) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };
  
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit to 3 or 4 digits
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvc(digits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !cardName || !expiryDate || !cvc) {
      toast({
        title: "Missing information",
        description: "Please fill out all payment fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user plan
      updateUserPlan(planId as 'free' | 'basic' | 'pro' | 'enterprise');
      
      toast({
        title: "Payment Successful!",
        description: `You're now subscribed to the ${selectedPlan.name} plan.`,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/pricing')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to pricing
        </Button>
        
        <div className="grid md:grid-cols-5 gap-6">
          {/* Order summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-700">Plan</span>
                  <span className="font-medium text-brand-700">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-700">Billing</span>
                  <span>{billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium text-gray-700">Price</span>
                  <span>${price.toFixed(2)} {billingCycle === 'monthly' ? '/month' : '/year'}</span>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="text-sm font-medium text-gray-700">Includes:</div>
                  <ul className="space-y-1">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment form */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input 
                        id="cardNumber" 
                        placeholder="1234 5678 9012 3456" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="pl-10"
                        maxLength={19}
                        required
                      />
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input 
                      id="cardName" 
                      placeholder="John Doe" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <div className="relative">
                        <Input 
                          id="expiryDate" 
                          placeholder="MM/YY" 
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          className="pl-10"
                          maxLength={5}
                          required
                        />
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <div className="relative">
                        <Input 
                          id="cvc" 
                          placeholder="123" 
                          value={cvc}
                          onChange={handleCvcChange}
                          className="pl-10"
                          maxLength={4}
                          required
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t pt-6">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Secure payment
                  </div>
                  <Button 
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-700 button-glow"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${price.toFixed(2)} ${billingCycle === 'monthly' ? '/month' : '/year'}`
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <p className="mt-4 text-xs text-gray-500 text-center">
              This is a demo page. No actual payment will be processed. 
              In a real application, this would securely process your payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
