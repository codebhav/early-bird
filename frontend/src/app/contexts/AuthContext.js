// src/app/contexts/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/api";

// Create the auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [authChecked, setAuthChecked] = useState(false);
	const router = useRouter();

	// Check if user is logged in on initial load
	useEffect(() => {
		async function checkAuth() {
			try {
				const token = localStorage.getItem("auth_token");

				if (token) {
					// Token exists, try to get user data
					api.setToken(token);
					const { user } = await api.getCurrentUser();
					setUser(user);
				}
			} catch (error) {
				console.error("Authentication error:", error);
				// Clear invalid token
				localStorage.removeItem("auth_token");
			} finally {
				setLoading(false);
				setAuthChecked(true);
			}
		}

		checkAuth();
	}, []);

	// Login with magic link
	const login = async (email) => {
		setLoading(true);
		try {
			const response = await api.requestMagicLink(email);
			return response;
		} finally {
			setLoading(false);
		}
	};

	// Verify magic link token
	const verifyToken = async (token) => {
		setLoading(true);
		try {
			const response = await api.verifyMagicLink(token);
			setUser(response.user);
			return response;
		} finally {
			setLoading(false);
		}
	};

	// Logout
	const logout = async () => {
		setLoading(true);
		try {
			await api.logout();
			setUser(null);
			router.push("/login");
		} finally {
			setLoading(false);
		}
	};

	// Update profile
	const updateProfile = async (userData) => {
		setLoading(true);
		try {
			const response = await api.updateProfile(userData);
			setUser(response.user);
			return response;
		} finally {
			setLoading(false);
		}
	};

	// Get updated user data
	const refreshUser = async () => {
		try {
			const { user } = await api.getCurrentUser();
			setUser(user);
			return user;
		} catch (error) {
			console.error("Error refreshing user:", error);
			return null;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				authChecked,
				login,
				verifyToken,
				logout,
				updateProfile,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
