import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock User & Session
export interface User {
  id: string;
  email: string;
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock successful authentication for the static site
    const mockUser: User = { id: 'admin', email: 'admin@local' };
    const mockSession: Session = { access_token: 'mock', user: mockUser };
    setSession(mockSession);
    setUser(mockUser);
    setLoading(false);
  }, []);

  const signOut = async () => {
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
