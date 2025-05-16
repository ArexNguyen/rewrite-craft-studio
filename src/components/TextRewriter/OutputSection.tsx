
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Check } from 'lucide-react';

interface OutputSectionProps {
  outputText: string;
  isProcessing: boolean;
  rewriteCount: number;
  copied: boolean;
  handleCopyToClipboard: () => void;
  demoMode: boolean;
}

const OutputSection = ({
  outputText,
  isProcessing,
  rewriteCount,
  copied,
  handleCopyToClipboard,
  demoMode
}: OutputSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Humanized Result</h3>
        {rewriteCount > 0 && !isProcessing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyToClipboard}
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
  );
};

export default OutputSection;
