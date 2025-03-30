// src/app/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to login page
		router.push("/login");
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="text-center">
				<h1 className="text-3xl font-bold mb-4">Early Bird</h1>
				<p className="text-xl mb-4">Loading...</p>
				<div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
			</div>
		</div>
	);
}
