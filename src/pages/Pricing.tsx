
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const { user, updateUserPlan } = useAuth();
  const navigate = useNavigate();
  const [activeBilling, setActiveBilling] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'For casual users',
      priceMonthly: 0,
      priceAnnual: 0,
      features: [
        '15 credits',
        'Standard writing styles',
        'Limited humanization',
        'Moderate AI detection bypass',
      ],
      button: 'Get Started',
      mostPopular: false,
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'For regular users',
      priceMonthly: 9.99,
      priceAnnual: 7.99,
      features: [
        '50 credits/month',
        'All writing styles',
        'Enhanced humanization',
        'Good AI detection bypass',
        'Email support'
      ],
      button: 'Subscribe',
      mostPopular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For power users',
      priceMonthly: 19.99,
      priceAnnual: 16.99,
      features: [
        '150 credits/month',
        'All writing styles',
        'Premium humanization',
        'Superior AI detection bypass',
        'Priority support',
        'Advanced settings'
      ],
      button: 'Subscribe',
      mostPopular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For teams & businesses',
      priceMonthly: 49.99,
      priceAnnual: 39.99,
      features: [
        '500 credits/month',
        'All writing styles',
        'Maximum humanization',
        'Best AI detection bypass',
        '24/7 priority support',
        'API access',
        'Team collaboration',
        'Custom branding'
      ],
      button: 'Contact Sales',
      mostPopular: false,
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (!user) {
      navigate('/login?redirect=pricing');
      return;
    }
    
    // For free tier just update the user plan
    if (planId === 'free') {
      updateUserPlan('free');
      return;
    }
    
    // For paid tiers, navigate to payment page with plan info
    navigate(`/payment?plan=${planId}&billing=${activeBilling}`);
  };

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.id === 'free') return 'Free';
    return activeBilling === 'monthly' 
      ? `$${plan.priceMonthly}/mo` 
      : `$${plan.priceAnnual}/mo`;
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for you. All plans include a 7-day free trial.
          </p>
          
          {/* Billing toggle */}
          <div className="flex justify-center mt-8 space-x-3 bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setActiveBilling('monthly')}
              className={`px-4 py-2 rounded-md ${
                activeBilling === 'monthly'
                  ? 'bg-white text-brand-700 shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActiveBilling('annual')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeBilling === 'annual'
                  ? 'bg-white text-brand-700 shadow-sm font-medium'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">Save 20%</Badge>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.mostPopular ? 'border-brand-400 shadow-lg shadow-brand-100/40 relative' : ''}`}>
              {plan.mostPopular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <Badge className="bg-brand-500 hover:bg-brand-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className={plan.mostPopular ? 'text-brand-600' : ''}>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{getPrice(plan)}</span>
                  {plan.id !== 'free' && (
                    <span className="text-gray-500 ml-2 text-sm">
                      {activeBilling === 'annual' ? 'billed annually' : ''}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={plan.mostPopular ? 'bg-brand-600 hover:bg-brand-700 w-full' : 'w-full'} 
                  variant={plan.mostPopular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.button}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">What are credits?</h3>
              <p className="text-gray-600">
                Credits are consumed each time you humanize a piece of text. One credit allows you to process approximately 500 words of text.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access to your plan until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Do credits roll over?</h3>
              <p className="text-gray-600">
                Unused credits expire at the end of your billing cycle for monthly plans. Annual plans allow for 10% of unused credits to roll over.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">How effective is the AI detection bypass?</h3>
              <p className="text-gray-600">
                TextHuman achieves a 95%+ bypass rate on common AI detection tools. Higher tier plans offer enhanced algorithms for even better results.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="mt-16 bg-gray-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Contact our sales team for tailored solutions that meet your specific requirements.
          </p>
          <Button variant="outline" size="lg" asChild>
            <a href="/contact">Contact Sales</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
