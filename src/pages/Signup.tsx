
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signup(email, username, password);
      // Redirect happens in the AuthContext
    } catch (error) {
      // Error is handled in AuthContext
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="py-16 min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
            <p className="text-gray-500">Enter your details to get started</p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  type="email" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  placeholder="Your preferred username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    type={showPassword ? 'text' : 'password'} 
                    minLength={6}
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleShowPassword} 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 pt-1">Password must be at least 6 characters</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-brand-600 hover:bg-brand-700 button-glow" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
              
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-600 hover:text-brand-800">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
          
          <div className="px-6 py-4 text-center text-xs text-gray-500 border-t">
            By signing up, you agree to our{" "}
            <a href="#" className="text-brand-600 hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
