
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fallbackRewrite } from '@/utils/textRewriteAPI';
import { supabase } from '@/integrations/supabase/client';

interface UseTextRewriterProps {
  demoMode?: boolean;
}

export const useTextRewriter = ({ demoMode = false }: UseTextRewriterProps) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rewriteCount, setRewriteCount] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('fluent');
  const [copied, setCopied] = useState(false);
  const { user, updateUserCredits } = useAuth();
  const { toast } = useToast();

  const handleRewriteText = async () => {
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
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('send-text-to-api', {
        body: {
          inputText,
          selectedStyle
        }
      });

      if (error) {
        throw error;
      }

      setOutputText(data.rewrittenText || '');
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
      console.error('Error calling edge function:', error);
      toast({
        title: "Error rewriting text",
        description: "There was a problem connecting to the rewriting service. Please try again.",
        variant: "destructive"
      });
      
      // Use fallback if API call fails
      const fallbackResult = fallbackRewrite(inputText);
      setOutputText(fallbackResult);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "The rewritten text has been copied to your clipboard."
    });
  };

  return {
    inputText,
    setInputText,
    outputText,
    isProcessing,
    rewriteCount,
    selectedStyle,
    setSelectedStyle,
    copied,
    handleRewriteText,
    handleCopyToClipboard
  };
};
