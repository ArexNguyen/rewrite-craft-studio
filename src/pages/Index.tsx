
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TextRewriter from '@/components/TextRewriter';
import { CheckCircle, Star, Zap, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-500 to-blue-500 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Make Your AI Text Sound <span className="text-yellow-300">Human Again</span>
          </h1>
          <p className="max-w-2xl text-xl sm:text-2xl mb-8">
            Transform AI-generated content into natural, human-like text that bypasses detection tools while preserving your message.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-gray-100" asChild>
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Try it for Free</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              See how TextHuman transforms AI-generated content into natural, human writing.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <TextRewriter demoMode={true} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose TextHuman?</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Our AI humanizer helps bypass detection tools while maintaining your message and style.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-brand-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bypass AI Detection</h3>
              <p className="text-gray-600">
                Our advanced algorithms transform AI-generated text to bypass detection tools like GPTZero and Turnitin.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Process your content in seconds, no matter how long. Save time while ensuring quality.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Styles</h3>
              <p className="text-gray-600">
                Choose from different writing styles to match your needs: fluent, creative, formal, or simple.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Preserve Meaning</h3>
              <p className="text-gray-600">
                Unlike other tools, we ensure your original meaning stays intact while making it sound human.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Humanize Your Content?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands of users who trust TextHuman to make their AI-generated content sound natural.
          </p>
          <Button size="lg" className="bg-brand-500 hover:bg-brand-600 button-glow" asChild>
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
