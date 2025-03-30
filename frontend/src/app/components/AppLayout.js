// src/app/components/AppLayout.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import Logo from "./logo";
import ThemeSwitcher from "./ThemeSwitcher";

export default function AppLayout({ children, showNav = true }) {
	const { user, loading, logout } = useAuth();
	const router = useRouter();
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	// If not authenticated, redirect to login
	useEffect(() => {
		if (!loading && !user) {
			router.push("/login");
		}
	}, [user, loading, router]);

	// Handle logout
	const handleLogout = async () => {
		try {
			await logout();
			router.push("/login");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="relative w-16 h-16 mx-auto mb-4">
						<Image
							src="/duck-logo.svg"
							alt="Loading"
							fill
							className="object-contain animate-bounce"
						/>
					</div>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						Loading...
					</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return null; // Will redirect to login in useEffect
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<header className="bg-white dark:bg-gray-800 shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
					<Logo />

					{showNav && (
						<div className="flex items-center space-x-4">
							<span className="flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 px-3 py-1 rounded-full">
								<svg
									className="h-4 w-4 mr-1"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
										clipRule="evenodd"
									/>
								</svg>
								<span>{user.quackCoins || 0} QuackCoins</span>
							</span>

							{/* Theme Switcher */}
							<ThemeSwitcher />

							{/* Desktop menu */}
							<div className="hidden md:flex items-center space-x-4">
								<Link
									href="/dashboard"
									className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
								>
									Dashboard
								</Link>
								<Link
									href="/profile"
									className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
								>
									Profile
								</Link>
								<button
									onClick={handleLogout}
									className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
								>
									Logout
								</button>
							</div>

							{/* Profile dropdown toggle */}
							<div className="md:hidden relative">
								<button
									className="flex items-center"
									onClick={() =>
										setShowMobileMenu(!showMobileMenu)
									}
									aria-expanded={showMobileMenu}
									aria-label="User menu"
								>
									<div className="relative w-8 h-8 rounded-full overflow-hidden">
										<Image
											src={
												user.avatar ||
												"/avatar-placeholder.png"
											}
											alt="Profile"
											fill
											className="object-cover"
										/>
									</div>
									<svg
										className="ml-1 h-5 w-5 text-gray-400"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</button>

								{/* Mobile menu dropdown */}
								{showMobileMenu && (
									<div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
										<span className="block px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
											{user.name}
										</span>
										<Link
											href="/dashboard"
											className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
											onClick={() =>
												setShowMobileMenu(false)
											}
										>
											Dashboard
										</Link>
										<Link
											href="/profile"
											className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
											onClick={() =>
												setShowMobileMenu(false)
											}
										>
											Profile
										</Link>
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
										>
											Logout
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</header>

			{/* Main content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>

			{/* Footer */}
			<footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<p className="text-center text-sm text-gray-500 dark:text-gray-400">
						Early Bird &copy; {new Date().getFullYear()} - Start
						assignments early, earn rewards!
					</p>
				</div>
			</footer>
		</div>
	);
}
