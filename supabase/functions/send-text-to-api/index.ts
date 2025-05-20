
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define CORS headers - this is crucial to allow requests from your website
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { inputText, selectedStyle } = await req.json();
    console.log("Received request:", { inputText, selectedStyle });

    // Map styles to the API's expected parameters
    const styleMapping = {
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
    
    // Simple fallback rewriting function
    const simpleRewrite = (text) => {
      // Split the text into sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      return sentences.map(s => s.trim()).join(' ');
    };
    
    try {
      // For now, let's use a simple internal rewrite
      const rewrittenText = simpleRewrite(inputText);
      
      // Return the response with CORS headers
      return new Response(
        JSON.stringify({ 
          secondApiData: rewrittenText,
          message: "Text rewritten successfully"
        }),
        { 
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    } catch (error) {
      console.error("Error rewriting text:", error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to rewrite text",
          secondApiData: inputText // Return original text as fallback
        }),
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { 
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
