// src/app/auth/verify/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/app/contexts/AuthContext";

export default function VerifyMagicLink() {
	const [verifying, setVerifying] = useState(true);
	const [error, setError] = useState("");
	const { verifyToken } = useAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	// src/app/auth/verify/page.js - Add retry mechanism
	useEffect(() => {
		let retryCount = 0;
		const maxRetries = 3;

		async function verifyMagicLink() {
			if (!token) {
				setError("Invalid link. No token provided.");
				setVerifying(false);
				return;
			}

			try {
				await verifyToken(token);
				// Redirect to dashboard after successful verification
				router.push("/dashboard");
			} catch (error) {
				if (retryCount < maxRetries) {
					retryCount++;
					// Wait 1 second before retrying
					setTimeout(verifyMagicLink, 1000);
				} else {
					setError(
						error.message ||
							"Invalid or expired link. Please try logging in again."
					);
					setVerifying(false);
				}
			}
		}

		verifyMagicLink();
	}, [token, verifyToken, router]);

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
					{verifying ? (
						<div className="text-center py-4">
							<div className="animate-spin h-16 w-16 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
							<h3 className="text-lg font-medium text-foreground mt-4">
								Verifying your magic link...
							</h3>
							<p className="text-foreground/70 mt-2">
								Please wait while we log you in.
							</p>
						</div>
					) : (
						<div className="text-center py-4">
							<svg
								className="mx-auto h-16 w-16 text-red-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							<h3 className="text-lg font-medium text-foreground mt-4">
								Link Verification Failed
							</h3>
							<p className="text-foreground/70 mt-2">{error}</p>
							<button
								onClick={() => router.push("/login")}
								className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
							>
								Back to Login
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
