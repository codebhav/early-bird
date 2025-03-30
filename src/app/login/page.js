// src/app/login/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/app/components/ThemeSwitcher";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const { user, authChecked, login } = useAuth();

	// Redirect if already logged in
	useEffect(() => {
		if (authChecked && user) {
			router.push("/dashboard");
		}
	}, [authChecked, user, router]);

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	// Replace the current handleSubmit with:
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!email || !validateEmail(email)) {
			setError("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);

		try {
			await login(email);
			setIsMagicLinkSent(true);

			// In development, auto-login after 3 seconds
			if (process.env.NODE_ENV === "development") {
				setTimeout(() => {
					router.push("/dashboard");
				}, 3000);
			}
		} catch (error) {
			console.error("Login error:", error);
			setError(
				error.message || "Failed to send login link. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
			<div className="absolute top-4 right-4">
				<ThemeSwitcher />
			</div>

			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="relative w-24 h-24 mx-auto mb-4">
						<Image
							src="/duck-logo.svg"
							alt="Early Bird Duck Logo"
							fill
							className="object-contain"
							priority
						/>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Early Bird
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mt-2">
						Start assignments early, earn rewards!
					</p>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
					{!isMagicLinkSent ? (
						<>
							<h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
								Log in to your account
							</h2>

							{error && (
								<div
									className="mb-4 p-3 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-md text-sm"
									role="alert"
								>
									{error}
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
									>
										Email address
									</label>
									<input
										id="email"
										type="email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										placeholder="your@email.com"
										className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
										required
										aria-required="true"
										aria-describedby="email-hint"
										disabled={isSubmitting}
									/>
									<p
										id="email-hint"
										className="mt-1 text-xs text-gray-500 dark:text-gray-400"
									>
										We'll send you a magic link to log in
									</p>
								</div>

								<button
									type="submit"
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
									disabled={isSubmitting}
									aria-busy={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Sending magic link...
										</>
									) : (
										"Send Magic Link"
									)}
								</button>
							</form>

							<div className="mt-6 text-center text-sm">
								<p className="text-gray-600 dark:text-gray-400">
									Don't have an account?
								</p>
								<button
									className="mt-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium focus:outline-none focus:underline"
									onClick={() =>
										alert(
											"In a real app, this would take you to a sign-up page!"
										)
									}
								>
									Sign up for Early Bird
								</button>
							</div>
						</>
					) : (
						<div className="text-center py-4">
							<svg
								className="mx-auto h-16 w-16 text-green-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">
								Magic link sent!
							</h3>
							<p className="text-gray-600 dark:text-gray-300 mt-2">
								Check your email for a link to log in.
							</p>
							<p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
								<em>
									For this demo, you'll be redirected to the
									dashboard automatically in a few seconds.
								</em>
							</p>
						</div>
					)}
				</div>

				<div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
					<p>
						© {new Date().getFullYear()} Early Bird. All rights
						reserved.
					</p>
				</div>
			</div>
		</div>
	);
}
