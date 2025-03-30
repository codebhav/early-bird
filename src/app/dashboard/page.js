// src/app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AssignmentCard from "@/app/components/AssignmentCard";
import ProgressSection from "@/app/components/ProgressSection";
import Leaderboard from "@/app/components/Leaderboard";
import { mockAssignments, mockFriends } from "@/app/data/mockData";

export default function Dashboard() {
	const [assignments, setAssignments] = useState([]);
	const [activeTab, setActiveTab] = useState("progress");
	const [user, setUser] = useState({
		name: "Student Name",
		email: "student@example.com",
		quackCoins: 120,
		avatar: "/avatar-placeholder.png",
	});

	// Fetch assignments (mock data for now)
	useEffect(() => {
		// Simulate API call delay
		const timer = setTimeout(() => {
			setAssignments(mockAssignments);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<header className="bg-white dark:bg-gray-800 shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
					<div className="flex items-center">
						<div className="relative w-10 h-10">
							<Image
								src="/duck-logo.svg"
								alt="Early Bird Logo"
								fill
								className="object-contain"
							/>
						</div>
						<h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
							Early Bird
						</h1>
					</div>

					<div className="flex items-center space-x-4">
						<span className="flex items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 px-3 py-1 rounded-full">
							<svg
								className="h-4 w-4 mr-1"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
									clipRule="evenodd"
								/>
							</svg>
							<span>{user.quackCoins} QuackCoins</span>
						</span>

						<Link href="/profile" className="flex items-center">
							<span className="sr-only">Your profile</span>
							<div className="relative w-8 h-8 rounded-full overflow-hidden">
								<Image
									src={user.avatar}
									alt="Profile"
									fill
									className="object-cover"
								/>
							</div>
							<span className="ml-2 font-medium text-gray-700 dark:text-gray-200">
								{user.name}
							</span>
						</Link>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
					Your Assignments
				</h2>

				{/* Assignment cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{assignments.length > 0 ? (
						assignments.map((assignment) => (
							<AssignmentCard
								key={assignment.id}
								assignment={assignment}
							/>
						))
					) : (
						<div className="col-span-full flex justify-center items-center py-12 text-gray-500 dark:text-gray-400">
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5"
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
							Loading assignments...
						</div>
					)}
				</div>

				{/* Tabs for Progress and Leaderboard */}
				<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
					<div className="border-b border-gray-200 dark:border-gray-700">
						<nav className="flex" aria-label="Tabs">
							<button
								onClick={() => setActiveTab("progress")}
								className={`px-6 py-3 text-sm font-medium ${
									activeTab === "progress"
										? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
										: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
								}`}
								aria-current={
									activeTab === "progress"
										? "page"
										: undefined
								}
							>
								Progress
							</button>
							<button
								onClick={() => setActiveTab("leaderboard")}
								className={`px-6 py-3 text-sm font-medium ${
									activeTab === "leaderboard"
										? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
										: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
								}`}
								aria-current={
									activeTab === "leaderboard"
										? "page"
										: undefined
								}
							>
								Leaderboard
							</button>
						</nav>
					</div>

					<div className="p-6">
						{activeTab === "progress" ? (
							<ProgressSection assignments={assignments} />
						) : (
							<Leaderboard friends={mockFriends} user={user} />
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
