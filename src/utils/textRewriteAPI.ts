
interface RewriteOptions {
  content: string;
  readability: string;
  purpose: string;
  strength: string;
}

export const rewriteText = async (text: string, style: string): Promise<string> => {
  // Map styles to the API's expected parameters
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
  
  const selectedMappings = styleMapping[style] || styleMapping.fluent;
  
  // Prepare the API request
  const response = await fetch('https://humanize.undetectable.ai/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: "79b84da7-bb2a-4e36-a135-e77e0f3e5144",
      content: text,
      readability: selectedMappings.readability,
      purpose: selectedMappings.purpose,
      strength: selectedMappings.strength,
      model: "v2",
      user_agent: "TextHuman Web App",
      document_type: "Text",
      url: "https://example.com/"
    })
  });
  
  if (!response.ok) {
    throw new Error(`API request failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Return the rewritten text based on API response format
  if (data && data.humanized_text) {
    return data.humanized_text;
  } else if (data && data.result) {
    return data.result;
  }
  
  throw new Error('Unexpected API response format');
};

// Helper functions for text transformation - kept as fallback
export function getAlternativeWord(word: string) {
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

export function getFormalWord(word: string) {
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

export function getSimpleWord(word: string) {
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

// Fallback function if API fails
export const fallbackRewrite = (text: string): string => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  return sentences.map(s => s.trim()).join(' ');
};
