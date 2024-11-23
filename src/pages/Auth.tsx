import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Reciter } from '@/types';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Fetch reciters data when component mounts
    const fetchReciters = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/reciters', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (response.ok) {
          const data = await response.json();
          setReciters(data);
        }
      } catch (error) {
        console.error('Error fetching reciters:', error);
      }
    };

    fetchReciters();
  }, []);

  const handleAuth = async (e: React.FormEvent, isAdmin: boolean) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const endpoint = isRegistering ? '/api/register' : '/api/login';
      console.log('Making auth request to:', endpoint);
      
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, isAdmin }),
      });

      const data = await response.json();
      console.log('Auth response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (!isRegistering) {
        login(data.token, data.isAdmin);
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        toast.success('Registration successful! Please login.');
        setIsRegistering(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col items-center justify-center p-4 space-y-8">
      {/* Progress Dashboard */}
      <Card className="w-full max-w-4xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Quran Recitation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reciters.map((reciter) => (
              <div key={reciter.id} className="p-4 border rounded-lg bg-white shadow-sm">
                <h3 className="font-semibold text-lg">{reciter.name}</h3>
                <p className="text-gray-600">
                  {reciter.assigned_juz 
                    ? `Assigned: Juz' ${reciter.assigned_juz}` 
                    : 'Not assigned yet'}
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${reciter.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-600">
                    {reciter.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Authentication Form */}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Quran Recitation Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user">
              <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isRegistering ? 'Register' : 'Login'}
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Admin Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isRegistering ? 'Register Admin' : 'Login as Admin'}
                </Button>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setIsRegistering(!isRegistering)}
                  >
                    {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;