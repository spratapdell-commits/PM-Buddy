import React, { useState } from 'react';
import { GoogleIcon, GitHubIcon } from './Icons';
import { USERS } from '../constants';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim()) {
        const user = USERS.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (user) {
            onLogin(user);
        } else {
            setError("User not found. Try 'Alex Reid' or 'Casey Lee'.");
        }
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    if (provider === 'google') setIsGoogleLoading(true);
    if (provider === 'github') setIsGitHubLoading(true);
    setError('');

    // --- In a real application ---
    // 1. This function would redirect to the backend:
    //    window.location.href = '/api/auth/google';
    
    // 2. The backend would handle the OAuth dance with the provider.
    //    It would need the client ID and secret.
    //    const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID; // SECRET: Add to secret manager
    //    const GOOGLE_OAUTH_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET; // SECRET: Add to secret manager

    // 3. After successful authentication, the backend would get the user's profile,
    //    find or create a user in the database, issue a JWT, and redirect
    //    back to the frontend with the token.

    // --- Simulation for this app ---
    // We'll simulate this flow with a timeout.
    setTimeout(() => {
        let user: User | undefined;
        if (provider === 'google') {
            // Simulate finding a user with a matching Google ID or email.
            user = USERS.find(u => u.googleId === 'google-alex-123') || USERS.find(u => u.email === 'alex@example.com');
            setIsGoogleLoading(false);
        }
        if (provider === 'github') {
             // Simulate finding a user with a matching GitHub ID or email.
            user = USERS.find(u => u.githubId === 'github-casey-456') || USERS.find(u => u.email === 'casey@example.com');
            setIsGitHubLoading(false);
        }
        
        if (user) {
            onLogin(user);
        } else {
            setError(`Could not log in with ${provider}. User not found or linked.`);
        }
    }, 1500);
  };


  return (
    <div className="flex items-center justify-center h-screen bg-pm-dark text-pm-text">
      <div className="w-full max-w-sm p-8 space-y-6 bg-pm-dark-secondary rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center">PM Buddy</h1>
        
        <div className="space-y-4">
             <button
                onClick={() => handleOAuthLogin('google')}
                disabled={isGoogleLoading || isGitHubLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 font-medium text-pm-text bg-pm-dark border border-pm-border rounded-md hover:bg-pm-border disabled:opacity-50"
            >
                {isGoogleLoading ? <Spinner /> : <GoogleIcon className="w-5 h-5" />}
                <span>Continue with Google</span>
            </button>
             <button
                onClick={() => handleOAuthLogin('github')}
                disabled={isGoogleLoading || isGitHubLoading}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 font-medium text-pm-text bg-pm-dark border border-pm-border rounded-md hover:bg-pm-border disabled:opacity-50"
            >
                {isGitHubLoading ? <Spinner /> : <GitHubIcon className="w-5 h-5" />}
                <span>Continue with GitHub</span>
            </button>
        </div>

        <div className="flex items-center">
            <div className="flex-grow border-t border-pm-border"></div>
            <span className="flex-shrink mx-4 text-xs text-pm-text-secondary">OR</span>
            <div className="flex-grow border-t border-pm-border"></div>
        </div>

        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-white bg-pm-dark border border-pm-border rounded-md focus:outline-none focus:ring-2 focus:ring-pm-blue"
              placeholder="e.g., Alex Reid"
            />
          </div>
           {error && <p className="text-sm text-pm-red text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 font-semibold text-white bg-pm-blue rounded-md hover:bg-pm-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pm-dark-secondary focus:ring-pm-blue"
          >
            Log In with Name
          </button>
        </form>
      </div>
    </div>
  );
};

const Spinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export default Login;
