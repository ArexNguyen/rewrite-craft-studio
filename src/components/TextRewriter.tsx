
import { useAuth } from '@/contexts/AuthContext';
import { useTextRewriter } from '@/hooks/useTextRewriter';
import InputSection from './TextRewriter/InputSection';
import OutputSection from './TextRewriter/OutputSection';

interface TextRewriterProps {
  demoMode?: boolean;
}

const TextRewriter = ({ demoMode = false }: TextRewriterProps) => {
  const { user } = useAuth();
  const {
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
  } = useTextRewriter({ demoMode });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputSection 
          inputText={inputText}
          setInputText={setInputText}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          isProcessing={isProcessing}
          handleRewriteText={handleRewriteText}
          demoMode={demoMode}
          user={user}
        />
        
        <OutputSection 
          outputText={outputText}
          isProcessing={isProcessing}
          rewriteCount={rewriteCount}
          copied={copied}
          handleCopyToClipboard={handleCopyToClipboard}
          demoMode={demoMode}
        />
      </div>
    </div>
  );
};

export default TextRewriter;
