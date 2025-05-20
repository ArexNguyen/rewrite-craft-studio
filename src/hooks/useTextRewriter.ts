
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { fallbackRewrite, rewriteText } from '@/utils/textRewriteAPI';
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
      console.log("Calling edge function with:", { inputText, selectedStyle });
      
      // First attempt - try using the Supabase edge function
      const { data, error } = await supabase.functions.invoke('send-text-to-api', {
        body: {
          inputText,
          selectedStyle
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data) {
        console.error("No data returned from edge function");
        throw new Error("No data returned from edge function");
      }

      console.log("Edge function response:", data);
      
      // Check if the response has the expected secondApiData property
      if (data.secondApiData !== undefined) {
        setOutputText(data.secondApiData);
      } else if (data.result !== undefined) {
        // Fallback to result property if secondApiData doesn't exist
        setOutputText(data.result);
      } else {
        // If neither property exists, try to use the data itself if it's a string
        setOutputText(typeof data === 'string' ? data : JSON.stringify(data));
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
      console.error('Error calling edge function:', error);
      
      // Second attempt - try using the direct API call if edge function fails
      try {
        console.log("Edge function failed, trying direct API call");
        const directResult = await rewriteText(inputText, selectedStyle);
        setOutputText(directResult);
        setRewriteCount(prev => prev + 1);
        
        if (!demoMode && user) {
          updateUserCredits(user.credits - 1);
          toast({
            title: "Rewrite complete (fallback)!",
            description: `Used 1 credit. Remaining: ${user.credits - 1} credits.`,
          });
        }
      } catch (directApiError) {
        console.error('Direct API call also failed:', directApiError);
        
        // Last resort fallback
        toast({
          title: "Error rewriting text",
          description: "All rewriting methods failed. Using simple fallback instead.",
          variant: "destructive"
        });
        
        const fallbackResult = fallbackRewrite(inputText);
        setOutputText(fallbackResult);
      }
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
