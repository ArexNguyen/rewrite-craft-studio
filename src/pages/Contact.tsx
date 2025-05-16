
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !topic || !message) {
      toast({
        title: "Error",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setName('');
      setEmail('');
      setTopic('');
      setMessage('');
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about our services or need help? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-brand-600 mr-4 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">support@texthuman.ai</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-brand-600 mr-4 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-brand-600 mr-4 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Office</h3>
                    <p className="text-gray-600">
                      123 AI Avenue<br />
                      Tech District<br />
                      San Francisco, CA 94107
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6 mt-8">
                  <h3 className="font-medium mb-3">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9AM - 6PM PST<br />
                    Saturday: 10AM - 2PM PST<br />
                    Sunday: Closed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea 
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      required
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-brand-600 hover:bg-brand-700 button-glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">How quickly can I expect a response?</h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer custom enterprise solutions?</h3>
              <p className="text-gray-600">
                Yes, we provide tailored solutions for enterprises with specific needs. Please contact us to discuss your requirements.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How can I report a technical issue?</h3>
              <p className="text-gray-600">
                You can report technical issues through this contact form by selecting "Technical Support" as the topic, or by emailing support@texthuman.ai directly.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee for all subscription plans. If you're not satisfied, please contact our billing department.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
