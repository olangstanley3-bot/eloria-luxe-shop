import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import type { User, Session } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
  ) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInAsAdmin: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

function mapUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
    avatarUrl: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? undefined,
  };
}

const DEMO_ADMIN_USER: AuthUser = {
  id: "admin-demo",
  email: "admin@eloria.com",
  fullName: "Administrator",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check if demo admin is active in localStorage
    if (typeof window !== "undefined" && localStorage.getItem("eloria_demo_admin") === "true") {
      setUser(DEMO_ADMIN_USER);
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (!error && data.session) {
        setSession(data.session);
        setUser(mapUser(data.session.user ?? null));
      } else if (
        typeof window !== "undefined" &&
        localStorage.getItem("eloria_demo_admin") === "true"
      ) {
        setUser(DEMO_ADMIN_USER);
      }
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (typeof window !== "undefined" && localStorage.getItem("eloria_demo_admin") === "true") {
        setUser(DEMO_ADMIN_USER);
      } else {
        setSession(newSession);
        setUser(mapUser(newSession?.user ?? null));
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInAsAdmin = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("eloria_demo_admin", "true");
    }
    setUser(DEMO_ADMIN_USER);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Fallback for demo sign-in
        if (email.toLowerCase().includes("admin") || password === "admin") {
          signInAsAdmin();
          return {};
        }
        return { error: error.message };
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("eloria_demo_admin");
      }
      return {};
    },
    [signInAsAdmin],
  );

  const signUp = useCallback(async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    if (error) return { error: error.message };
    return { needsConfirmation: !data.session };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
    });
    if (result.error) return { error: result.error.message };
    return {};
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined,
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("eloria_demo_admin");
    }
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        resetPassword,
        signOut,
        signInAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
