
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      
      // Redirect to appropriate page after login
      if (redirect) {
        navigate(`/${redirect}`);
      }
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
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <p className="text-gray-500">Enter your credentials to access your account</p>
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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    type={showPassword ? 'text' : 'password'} 
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
              </div>

              <div className="text-sm text-right">
                <a href="#forgot-password" className="text-brand-600 hover:text-brand-800">
                  Forgot password?
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-brand-600 hover:bg-brand-700 button-glow" 
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-brand-600 hover:text-brand-800">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>

          {/* Demo accounts info */}
          <div className="p-4 mt-2 border-t text-sm text-gray-500">
            <p className="text-center font-medium mb-2">Demo Accounts:</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Free User:</strong></p>
                <p>test@example.com</p>
                <p>password123</p>
              </div>
              <div>
                <p><strong>Pro User:</strong></p>
                <p>pro@example.com</p>
                <p>password123</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
