// src/app/login/page.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate email
		if (!email || !email.includes("@")) {
			alert("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);

		// In a real app, this would connect to your auth provider
		// For now we'll simulate the magic link being sent
		setTimeout(() => {
			setIsSubmitting(false);
			setIsMagicLinkSent(true);

			// For demo purposes, let's redirect to dashboard after 3 seconds
			setTimeout(() => {
				window.location.href = "/dashboard";
			}, 3000);
		}, 1500);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
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
					<h1 className="text-3xl font-bold text-foreground">
						Early Bird
					</h1>
					<p className="text-foreground/70 mt-2">
						Start assignments early, earn rewards!
					</p>
				</div>

				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
					{!isMagicLinkSent ? (
						<>
							<h2 className="text-xl font-semibold mb-6 text-center">
								Log in to your account
							</h2>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label
										htmlFor="email"
										className="block text-sm font-medium text-foreground/80 mb-1"
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
										className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
										required
										aria-required="true"
									/>
								</div>
								<button
									type="submit"
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
									disabled={isSubmitting}
									aria-busy={isSubmitting}
								>
									{isSubmitting ? (
										<span className="flex items-center">
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
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
										</span>
									) : (
										"Send Magic Link"
									)}
								</button>
							</form>
							<div className="mt-6 text-center text-sm">
								<p>Don't have an account?</p>
								<button
									className="text-blue-600 hover:text-blue-800 font-medium"
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
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<h3 className="text-lg font-medium text-foreground mt-4">
								Magic link sent!
							</h3>
							<p className="text-foreground/70 mt-2">
								Check your email for a link to log in.
							</p>
							<p className="text-foreground/70 mt-1">
								<small>
									(Redirecting to dashboard for demo
									purposes...)
								</small>
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
