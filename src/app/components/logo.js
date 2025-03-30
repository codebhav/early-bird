// src/app/components/Logo.js
"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo({ size = "medium", withText = true, href = "/" }) {
	// Define size classes
	const sizes = {
		small: {
			container: "w-8 h-8",
			textClass: "ml-2 text-lg",
		},
		medium: {
			container: "w-10 h-10",
			textClass: "ml-3 text-xl",
		},
		large: {
			container: "w-16 h-16",
			textClass: "ml-4 text-2xl",
		},
	};

	const { container, textClass } = sizes[size] || sizes.medium;

	return (
		<Link
			href={href}
			className="flex items-center"
			aria-label="Early Bird Homepage"
		>
			<div className={`relative ${container}`}>
				<Image
					src="/duck-logo.svg"
					alt="Early Bird Logo"
					fill
					className="object-contain"
					priority
				/>
			</div>
			{withText && (
				<h1
					className={`${textClass} font-bold text-gray-900 dark:text-white`}
				>
					Early Bird
				</h1>
			)}
		</Link>
	);
}
