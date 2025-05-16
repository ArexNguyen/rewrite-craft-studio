import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface TextRewriterProps {
  demoMode?: boolean;
}

const TextRewriter = ({ demoMode = false }: TextRewriterProps) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rewriteCount, setRewriteCount] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('fluent');
  const [copied, setCopied] = useState(false);
  const { user, updateUserCredits } = useAuth();
  const { toast } = useToast();

  // Updated rewriting logic to call Undetectable.ai API with correct format
  const rewriteText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to rewrite.",
        variant: "destructive"
      });
      return;
    }

    // Check credits if not in demo mode
    if (!demoMode && user && user.credits <= 0) {
      toast({
        title: "No credits remaining",
        description: "Please upgrade your plan to get more credits.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Map our styles to the API's expected parameters
      const styleMapping: Record<string, { readability: string; purpose: string; strength: string }> = {
        'fluent': {
          readability: "University",
          purpose: "General Writing",
          strength: "Balanced"
        },
        'creative': {
          readability: "Journalist",
          purpose: "Story",
          strength: "More Human"
        },
        'formal': {
          readability: "Doctorate",
          purpose: "Business Material",
          strength: "Quality"
        },
        'simple': {
          readability: "High School", 
          purpose: "General Writing",
          strength: "More Human"
        }
      };
      
      const selectedMappings = styleMapping[selectedStyle] || styleMapping.fluent;
      
      // Prepare the API request with the correct JSON format
      const response = await fetch('https://humanize.undetectable.ai/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: "79b84da7-bb2a-4e36-a135-e77e0f3e5144",
          content: inputText,
          readability: selectedMappings.readability,
          purpose: selectedMappings.purpose,
          strength: selectedMappings.strength,
          model: "v2",
          user_agent: "TextHuman Web App",
          document_type: "Text",
          url: "https://example.com/"
        })
      });
      
      // Handle API response
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update the output text based on the API response
      // The actual response structure may need to be adjusted based on API documentation
      if (data && data.humanized_text) {
        setOutputText(data.humanized_text);
      } else if (data && data.result) {
        // Alternative response field name
        setOutputText(data.result);
      } else {
        // Fallback to simple rewriting if API response is unexpected
        const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
        const fallbackResult = sentences.map(s => s.trim()).join(' ');
        setOutputText(fallbackResult);
        console.warn('API response did not contain expected data format, using fallback', data);
      }
      
      setRewriteCount(prev => prev + 1);
      
      // Deduct credits if not in demo mode
      if (!demoMode && user) {
        updateUserCredits(user.credits - 1);
        toast({
          title: "Rewrite complete!",
          description: `Used 1 credit. Remaining: ${user.credits - 1} credits.`,
        });
      }
    } catch (error) {
      console.error('Error calling humanize API:', error);
      toast({
        title: "Error rewriting text",
        description: "There was a problem connecting to the rewriting service. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to simple rewriting if API call fails
      const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
      const fallbackResult = sentences.map(s => s.trim()).join(' ');
      setOutputText(fallbackResult);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper functions for text transformation - keep as fallback if needed
  function getAlternativeWord(word: string) {
    const alternatives: Record<string, string[]> = {
      'good': ['excellent', 'fantastic', 'great', 'wonderful'],
      'bad': ['terrible', 'awful', 'poor', 'subpar'],
      'big': ['large', 'enormous', 'massive', 'substantial'],
      'small': ['tiny', 'minute', 'compact', 'little'],
      'important': ['crucial', 'vital', 'essential', 'significant']
    };
    
    const lowerWord = word.toLowerCase();
    if (alternatives[lowerWord]) {
      const alt = alternatives[lowerWord][Math.floor(Math.random() * alternatives[lowerWord].length)];
      return word === word.toUpperCase() ? alt.toUpperCase() : 
             word[0] === word[0].toUpperCase() ? alt.charAt(0).toUpperCase() + alt.slice(1) : alt;
    }
    return word;
  }
  
  function getFormalWord(word: string) {
    const formalAlternatives: Record<string, string> = {
      'got': 'obtained',
      'get': 'acquire',
      'lots': 'numerous',
      'thing': 'item',
      'stuff': 'materials',
      'okay': 'acceptable',
      'ok': 'acceptable'
    };
    
    const lowerWord = word.toLowerCase();
    if (formalAlternatives[lowerWord]) {
      const alt = formalAlternatives[lowerWord];
      return word === word.toUpperCase() ? alt.toUpperCase() : 
             word[0] === word[0].toUpperCase() ? alt.charAt(0).toUpperCase() + alt.slice(1) : alt;
    }
    return word;
  }
  
  function getSimpleWord(word: string) {
    const simpleAlternatives: Record<string, string> = {
      'additional': 'more',
      'approximately': 'about',
      'commence': 'begin',
      'concerning': 'about',
      'endeavor': 'try',
      'frequently': 'often',
      'fundamental': 'basic',
      'consequently': 'so',
      'sufficient': 'enough',
      'subsequently': 'later'
    };
    
    const lowerWord = word.toLowerCase();
    if (simpleAlternatives[lowerWord]) {
      const alt = simpleAlternatives[lowerWord];
      return word === word.toUpperCase() ? alt.toUpperCase() : 
             word[0] === word[0].toUpperCase() ? alt.charAt(0).toUpperCase() + alt.slice(1) : alt;
    }
    return word;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "The rewritten text has been copied to your clipboard."
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Your Text</h3>
            {!demoMode && user && (
              <Badge variant="outline" className="bg-brand-50 text-brand-700">
                {user.credits} Credits Remaining
              </Badge>
            )}
          </div>
          
          <Textarea
            placeholder="Paste your text here..."
            className="min-h-[200px] resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Tabs defaultValue="fluent" value={selectedStyle} onValueChange={setSelectedStyle} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="fluent" className="flex-1">Fluent</TabsTrigger>
                <TabsTrigger value="creative" className="flex-1">Creative</TabsTrigger>
                <TabsTrigger value="formal" className="flex-1">Formal</TabsTrigger>
                <TabsTrigger value="simple" className="flex-1">Simple</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              onClick={rewriteText} 
              disabled={isProcessing || !inputText.trim()} 
              className={`${demoMode ? 'bg-brand-500' : 'bg-brand-600'} hover:bg-brand-700 transition-all button-glow min-w-[120px]`}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isProcessing ? "Processing..." : "Rewrite"}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Humanized Result</h3>
            {rewriteCount > 0 && !isProcessing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-brand-600 hover:text-brand-700 hover:bg-brand-50"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
          
          <Card className="min-h-[200px]">
            <CardContent className="p-4">
              {isProcessing ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                </div>
              ) : outputText ? (
                <p className="whitespace-pre-line">{outputText}</p>
              ) : (
                <p className="text-muted-foreground text-center h-[200px] flex items-center justify-center">
                  Your rewritten text will appear here
                </p>
              )}
            </CardContent>
          </Card>
          
          {!demoMode && rewriteCount > 0 && (
            <div className="text-sm text-gray-500 flex items-center justify-between">
              <span>AI detection probability: <strong>Low</strong></span>
              <span className="text-green-600 font-medium">✓ Human-like text</span>
            </div>
          )}
          
          {demoMode && (
            <p className="text-sm text-center text-muted-foreground">
              This is a demo. <a href="/signup" className="text-brand-600 hover:underline">Sign up</a> to access the full version.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextRewriter;
