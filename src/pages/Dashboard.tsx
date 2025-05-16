
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextRewriter from '@/components/TextRewriter';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Clock, BarChart3, History, Plus, RefreshCcw } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface Project {
  id: string;
  title: string;
  lastEdited: string;
  status: 'completed' | 'in-progress';
  contentPreview: string;
  byteSize: number;
}

const Dashboard = () => {
  const { user, loading, updateUserCredits } = useAuth();
  const [activeTab, setActiveTab] = useState('rewriter');
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  // Mock data for projects
  useEffect(() => {
    if (user) {
      setProjects([
        {
          id: '1',
          title: 'Essay Draft',
          lastEdited: '2 days ago',
          status: 'completed',
          contentPreview: 'The impact of artificial intelligence on modern society has been profound...',
          byteSize: 12400
        },
        {
          id: '2',
          title: 'Marketing Copy',
          lastEdited: '5 hours ago',
          status: 'completed',
          contentPreview: 'Introducing our revolutionary product that transforms how you...',
          byteSize: 5200
        },
        {
          id: '3',
          title: 'Blog Post',
          lastEdited: 'Just now',
          status: 'in-progress',
          contentPreview: 'Top 10 strategies for effective content marketing in 2025...',
          byteSize: 8900
        }
      ]);
    }
  }, [user]);
  
  const handleRefreshCredits = () => {
    if (user) {
      // Add 5 free credits
      updateUserCredits(user.credits + 5);
      toast({
        title: "Credits Refreshed!",
        description: "5 credits have been added to your account.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCcw className="h-8 w-8 animate-spin text-brand-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
          <p className="text-gray-600 mt-1">Manage your text humanization projects</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">
                  {user.credits}
                </div>
                <Button size="sm" variant="outline" onClick={handleRefreshCredits} className="text-brand-600 hover:text-brand-700">
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
              <Progress value={(user.credits / getPlanMaxCredits(user.plan)) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {user.plan === 'free' ? 'Free' : 'Paid'} plan ({user.credits}/{getPlanMaxCredits(user.plan)})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center">
                {formatPlanName(user.plan)}
                {user.plan === 'free' && (
                  <Link to="/pricing">
                    <Badge variant="outline" className="ml-2 bg-brand-100 text-brand-700 hover:bg-brand-200">
                      Upgrade
                    </Badge>
                  </Link>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Member since {formatDate(user.createdAt)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {projects.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{projects.filter(p => p.status === 'completed').length} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Usage This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {getPlanMaxCredits(user.plan) - user.credits}
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                <span>Normal usage</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="rewriter">
              <FileText className="h-4 w-4 mr-2" />
              Text Rewriter
            </TabsTrigger>
            <TabsTrigger value="projects">
              <History className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Rewriter Tab */}
          <TabsContent value="rewriter" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Text Humanizer</CardTitle>
                <CardDescription>
                  Transform your AI-generated content into natural human-written text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TextRewriter />
              </CardContent>
              {user.credits < 5 && (
                <CardFooter className="bg-amber-50 border-t border-amber-200">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-amber-800 text-sm font-medium">Your credits are running low</p>
                      <p className="text-amber-700 text-xs mt-1">
                        <Link to="/pricing" className="text-amber-800 font-medium hover:underline">Upgrade your plan</Link> or refresh your credits to continue using the service.
                      </p>
                    </div>
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Projects</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            
            <div className="grid gap-4">
              {projects.length > 0 ? (
                projects.map(project => (
                  <Card key={project.id} className="hover:border-brand-300 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-md bg-gray-100">
                            <FileText className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{project.title}</h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Last edited {project.lastEdited}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Badge variant={project.status === 'completed' ? 'outline' : 'secondary'} className={project.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                            {project.status === 'completed' ? 'Completed' : 'In Progress'}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-600 truncate">{project.contentPreview}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-gray-500">{formatBytes(project.byteSize)}</span>
                          <Button variant="ghost" size="sm">View Project</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">No projects yet. Create your first project to get started.</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
                <CardDescription>
                  Track your text humanization usage and patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-center items-center h-64 bg-gray-50 rounded-md">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-300 mx-auto" />
                    <p className="mt-4 text-gray-500">Analytics will be available after more usage data is collected</p>
                    {user.plan === 'free' && (
                      <Link to="/pricing" className="inline-block mt-4">
                        <Button variant="outline" size="sm">
                          Upgrade for advanced analytics
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Integration Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Integration</CardTitle>
            <CardDescription>
              Connect to the Undetectable.ai API for enhanced humanization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-md p-4 border border-dashed border-gray-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="font-medium">Undetectable.ai API Integration</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Connect your Undetectable.ai API key to use their advanced humanization algorithms.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="bg-white border-brand-300 text-brand-700 hover:bg-brand-50"
                >
                  Configure API
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper functions
function formatPlanName(plan: string): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function getPlanMaxCredits(plan: string): number {
  switch (plan) {
    case 'basic': return 50;
    case 'pro': return 150;
    case 'enterprise': return 500;
    default: return 15; // Free plan
  }
}

export default Dashboard;
