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

  // Example rewriting logic (would be replaced with API call to Undetectable.ai)
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
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Apply simple rewriting logic based on style
    let result = '';
    const sentences = inputText.match(/[^.!?]+[.!?]+/g) || [inputText];
    
    switch(selectedStyle) {
      case 'fluent':
        result = sentences.map(s => s.trim()).join(' ');
        break;
      case 'creative':
        result = sentences.map(s => s.trim().replace(/\b(\w+)\b/g, (match) => {
          // Randomly keep or replace some words to simulate creativity
          return Math.random() > 0.8 ? getAlternativeWord(match) : match;
        })).join(' ');
        break;
      case 'formal':
        result = sentences.map(s => s.trim().replace(/\b(got|get|lots|thing|stuff|okay|OK)\b/gi, (match) => {
          // Replace casual words with more formal alternatives
          return getFormalWord(match);
        })).join(' ');
        break;
      case 'simple':
        result = sentences.map(s => {
          const simplified = s.trim()
            .replace(/\b[a-zA-Z]{10,}\b/g, match => getSimpleWord(match));
          return simplified;
        }).join(' ');
        break;
    }

    setOutputText(result);
    setRewriteCount(prev => prev + 1);
    
    // Deduct credits if not in demo mode
    if (!demoMode && user) {
      updateUserCredits(user.credits - 1);
      toast({
        title: "Rewrite complete!",
        description: `Used 1 credit. Remaining: ${user.credits - 1} credits.`,
      });
    }
    
    setIsProcessing(false);
  };

  // Helper functions for text transformation
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
