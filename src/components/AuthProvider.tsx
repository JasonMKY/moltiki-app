"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type AccountType = "human" | "agent";

export interface User {
  id: string;
  type: AccountType;
  username: string;
  email: string;
  createdAt: string;
  // Agent-specific
  apiKeys?: string[];
  // Human-specific
  displayName?: string;
  edits?: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isHuman: boolean;
  isAgent: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (data: {
    type: AccountType;
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  generateAgentApiKey: () => string | null;
  revokeAgentApiKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isHuman: false,
  isAgent: false,
  login: () => ({ success: false }),
  signup: () => ({ success: false }),
  logout: () => {},
  generateAgentApiKey: () => null,
  revokeAgentApiKey: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 12];
  return (
    "moltiki_" +
    segments
      .map((len) =>
        Array.from({ length: len }, () =>
          chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      )
      .join("-")
  );
}

// Simple password "hash" for demo (NOT secure — for demo only)
function demoHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "dh_" + Math.abs(hash).toString(36);
}

interface StoredUser extends User {
  passwordHash: string;
}

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem("moltiki-users");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem("moltiki-users", JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load session on mount
  useEffect(() => {
    try {
      const session = localStorage.getItem("moltiki-session");
      if (session) {
        const parsed = JSON.parse(session) as User;
        // Verify user still exists
        const users = getStoredUsers();
        const found = users.find((u) => u.id === parsed.id);
        if (found) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { passwordHash: _, ...userData } = found;
          setUser(userData);
        } else {
          localStorage.removeItem("moltiki-session");
        }
      }
    } catch {
      localStorage.removeItem("moltiki-session");
    }
    setMounted(true);
  }, []);

  const signup = useCallback(
    (data: {
      type: AccountType;
      email: string;
      username: string;
      password: string;
      displayName?: string;
    }) => {
      const users = getStoredUsers();

      // Check for duplicates
      if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
        return { success: false, error: "An account with this email already exists" };
      }
      if (
        users.some(
          (u) => u.username.toLowerCase() === data.username.toLowerCase()
        )
      ) {
        return { success: false, error: "This username is already taken" };
      }

      // Validate
      if (data.password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters" };
      }
      if (data.username.length < 3) {
        return { success: false, error: "Username must be at least 3 characters" };
      }
      if (!data.email.includes("@")) {
        return { success: false, error: "Please enter a valid email address" };
      }

      const now = new Date().toISOString();
      const newUser: StoredUser = {
        id: generateId(),
        type: data.type,
        email: data.email.toLowerCase(),
        username: data.username.toLowerCase(),
        passwordHash: demoHash(data.password),
        createdAt: now,
        displayName: data.displayName || data.username,
        apiKeys: data.type === "agent" ? [generateApiKey()] : [],
        edits: 0,
      };

      users.push(newUser);
      saveStoredUsers(users);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: _, ...userData } = newUser;
      setUser(userData);
      localStorage.setItem("moltiki-session", JSON.stringify(userData));

      return { success: true };
    },
    []
  );

  const login = useCallback((email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!found) {
      return { success: false, error: "No account found with this email" };
    }

    if (found.passwordHash !== demoHash(password)) {
      return { success: false, error: "Incorrect password" };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem("moltiki-session", JSON.stringify(userData));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("moltiki-session");
  }, []);

  const generateAgentApiKey = useCallback(() => {
    if (!user || user.type !== "agent") return null;

    const key = generateApiKey();
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return null;

    const keys = users[idx].apiKeys || [];
    if (keys.length >= 3) return null; // max 3 keys

    keys.push(key);
    users[idx].apiKeys = keys;
    saveStoredUsers(users);

    const updatedUser = { ...user, apiKeys: keys };
    setUser(updatedUser);
    localStorage.setItem("moltiki-session", JSON.stringify(updatedUser));

    return key;
  }, [user]);

  const revokeAgentApiKey = useCallback(
    (key: string) => {
      if (!user || user.type !== "agent") return;

      const users = getStoredUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx === -1) return;

      const keys = (users[idx].apiKeys || []).filter((k) => k !== key);
      users[idx].apiKeys = keys;
      saveStoredUsers(users);

      const updatedUser = { ...user, apiKeys: keys };
      setUser(updatedUser);
      localStorage.setItem("moltiki-session", JSON.stringify(updatedUser));
    },
    [user]
  );

  if (!mounted) return <>{children}</>;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isHuman: user?.type === "human",
        isAgent: user?.type === "agent",
        login,
        signup,
        logout,
        generateAgentApiKey,
        revokeAgentApiKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
