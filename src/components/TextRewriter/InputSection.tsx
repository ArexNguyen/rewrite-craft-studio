
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { User } from '@/contexts/AuthContext';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  isProcessing: boolean;
  handleRewriteText: () => void;
  demoMode: boolean;
  user: User | null;
}

const InputSection = ({
  inputText,
  setInputText,
  selectedStyle,
  setSelectedStyle,
  isProcessing,
  handleRewriteText,
  demoMode,
  user
}: InputSectionProps) => {
  return (
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
          onClick={handleRewriteText} 
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
  );
};

export default InputSection;
