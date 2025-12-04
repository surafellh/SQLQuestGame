
import React, { useState } from 'react';
import { Database, UserPlus, Loader2, Mail, Lock, User, LogIn, Github, Facebook } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLogin: (user: UserProfile) => void;
  usersDb: UserProfile[]; // passed from App for persistence check
  onRegister: (newUser: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, usersDb, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate Network Delay
    setTimeout(() => {
      const normalizedEmail = email.toLowerCase().trim();

      if (isLoginMode) {
        // Login Logic
        const existingUser = usersDb.find(u => u.email === normalizedEmail);
        if (existingUser) {
           // In a real app, we would check password hash here
           onLogin(existingUser);
        } else {
           setError("Invalid email or password.");
           setIsLoading(false);
        }
      } else {
        // Registration Logic
        if (usersDb.some(u => u.email === normalizedEmail)) {
           setError("User already exists with this email.");
           setIsLoading(false);
           return;
        }

        const isAdmin = normalizedEmail === 'admin@sqlquest.com' || normalizedEmail === 'srflhb22@gmail.com';

        const newUser: UserProfile = {
          id: `user_${Date.now()}`,
          email: normalizedEmail,
          name: name || normalizedEmail.split('@')[0],
          role: isAdmin ? 'admin' : 'user',
          level: 1,
          xp: 0,
          stars: 0,
          completedChallenges: [],
          avatar: 'bg-gradient-to-tr from-quest-accent to-purple-500',
          theme: 'cosmic',
          joinDate: new Date().toISOString()
        };
        onRegister(newUser);
      }
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
      // Simulation
      alert(`Connecting to ${provider}... (Simulation)`);
  };

  return (
    <div className="min-h-screen bg-quest-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="mb-8 text-center animate-fade-in-down z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-quest-800 border border-quest-700 mb-6 shadow-2xl shadow-blue-900/30 rotate-3 hover:rotate-6 transition-transform">
          <Database className="w-10 h-10 text-quest-accent" />
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight mb-2">SQL Quest</h1>
        <p className="text-quest-400 text-lg">Master BigQuery. Build your legacy.</p>
      </div>

      <div className="w-full max-w-md bg-quest-800/80 backdrop-blur-xl border border-quest-700 rounded-2xl shadow-2xl overflow-hidden z-10">
        <div className="p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            {isLoginMode ? <LogIn className="text-quest-accent" size={20} /> : <UserPlus className="text-quest-accent" size={20} />}
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-medium text-quest-400 uppercase tracking-wider mb-1.5">Display Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-quest-500" />
                  </div>
                  <input
                    type="text"
                    required={!isLoginMode}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-quest-900/50 border border-quest-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-quest-accent focus:border-quest-accent block w-full pl-10 p-3 placeholder-quest-600 transition-all"
                    placeholder="DataWizard"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-quest-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-quest-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-quest-900/50 border border-quest-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-quest-accent focus:border-quest-accent block w-full pl-10 p-3 placeholder-quest-600 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-medium text-quest-400 uppercase tracking-wider">Password</label>
                  {isLoginMode && (
                      <button type="button" className="text-xs text-quest-accent hover:text-blue-400" onClick={() => alert("Check your email for reset instructions (Simulated).")}>
                          Forgot Password?
                      </button>
                  )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-quest-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-quest-900/50 border border-quest-600 text-white text-sm rounded-lg focus:ring-2 focus:ring-quest-accent focus:border-quest-accent block w-full pl-10 p-3 placeholder-quest-600 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 rounded text-xs text-red-200 text-center">
                    {error}
                </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-quest-accent hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-800 font-bold rounded-lg text-sm px-5 py-3 text-center transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-blue-900/50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLoginMode ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
              <div className="h-px bg-quest-700 flex-1"></div>
              <span className="text-xs text-quest-500 uppercase">Or continue with</span>
              <div className="h-px bg-quest-700 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleSocialLogin('Google')} className="flex items-center justify-center gap-2 p-2.5 bg-quest-900 border border-quest-600 rounded-lg hover:bg-quest-700 transition-colors text-sm text-gray-300 font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Google
              </button>
              <button onClick={() => handleSocialLogin('Facebook')} className="flex items-center justify-center gap-2 p-2.5 bg-quest-900 border border-quest-600 rounded-lg hover:bg-quest-700 transition-colors text-sm text-gray-300 font-medium">
                  <Facebook size={16} className="text-blue-500" />
                  Facebook
              </button>
          </div>

        </div>
        <div className="px-8 py-4 bg-quest-900/50 border-t border-quest-700 text-center">
            <p className="text-xs text-quest-400">
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                <button 
                    onClick={() => { setIsLoginMode(!isLoginMode); setError(null); }}
                    className="ml-1 text-quest-accent hover:underline font-bold"
                >
                    {isLoginMode ? 'Sign Up' : 'Log In'}
                </button>
            </p>
        </div>
      </div>
      
      <div className="mt-8 text-quest-600 text-xs">
         &copy; 2024 SQL Quest. Educational Platform.
      </div>
    </div>
  );
};
