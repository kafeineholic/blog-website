'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
	token: string | null;
	isLoggedIn: boolean;
	setToken: (token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setTokenState] = useState<string | null>(null);

	useEffect(() => {
		const savedToken = localStorage.getItem('authToken');
		if (savedToken) {
			setTokenState(savedToken);
		}
	}, []);

	const setToken = (nextToken: string) => {
		setTokenState(nextToken);
		localStorage.setItem('authToken', nextToken);
	};

	const logout = () => {
		setTokenState(null);
		localStorage.removeItem('authToken');
	};

	const value = useMemo(
		() => ({
			token,
			isLoggedIn: Boolean(token),
			setToken,
			logout,
		}),
		[token]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
