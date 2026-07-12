import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/tripService';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePresetSelect = (presetEmail, presetRole) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      toast.success('Successfully logged in!');
      onLoginSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md bg-white border border-outline-variant rounded-xl shadow-lg p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center font-black text-2xl mb-4 mx-auto">
            T
          </div>
          <h2 className="font-headline-md text-headline-md text-primary font-black text-2xl">
            TransitOps Console
          </h2>
          <p className="text-sm text-secondary mt-1">
            Log in to manage trip dispatches
          </p>
        </div>

        {/* Preset accounts helper */}
        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg mb-6">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2">
            Quick-Select Test Accounts
          </p>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => handlePresetSelect('dispatcher@transitops.co', 'Dispatcher')}
              className="flex-1 text-[11px] font-bold bg-white hover:bg-surface-container py-2 px-3 border border-outline-variant rounded transition-all active:scale-95"
            >
              🔑 Dispatcher
            </button>
            <button 
              type="button"
              onClick={() => handlePresetSelect('manager@transitops.co', 'Fleet Manager')}
              className="flex-1 text-[11px] font-bold bg-white hover:bg-surface-container py-2 px-3 border border-outline-variant rounded transition-all active:scale-95"
            >
              💼 Manager
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-secondary">
              Email Address
            </label>
            <input 
              required
              type="email"
              placeholder="name@transitops.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-secondary">
              Password
            </label>
            <input 
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg font-bold text-sm text-on-primary transition-all active:scale-[0.98] ${
              loading 
                ? 'bg-primary/50 cursor-wait' 
                : 'bg-primary hover:bg-primary-container'
            }`}
          >
            {loading ? 'Authenticating...' : 'Sign In to Console'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
