// src/app/profile/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Profile() {
	const { user, updateProfile } = useAuth();
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [formData, setFormData] = useState({
		name: "Student Name",
		email: "student@example.com",
		quackCoins: 0,
		avatar: "/avatar-placeholder.png",
		major: "Computer Science",
		year: "Junior",
		bio: "I love learning and completing assignments early!",
		preferences: {
			emailNotifications: true,
			reminderTime: 3, // days before deadline
			darkMode: false,
		},
	});

	// Initialize form data when user is loaded
	useEffect(() => {
		if (user) {
			setFormData({
				name: user.name || "Student Name",
				email: user.email || "student@example.com",
				quackCoins: user.quackCoins || 0,
				avatar: user.avatar || "/avatar-placeholder.png",
				major: user.major || "Computer Science",
				year: user.year || "Junior",
				bio:
					user.bio ||
					"I love learning and completing assignments early!",
				preferences: {
					emailNotifications:
						user.preferences?.emailNotifications ?? true,
					reminderTime: user.preferences?.reminderTime ?? 3,
					darkMode: user.preferences?.darkMode ?? false,
				},
			});
			setIsLoading(false);
		} else if (user === null) {
			// If user is explicitly null (not just loading), we can use defaults
			setIsLoading(false);
		}
	}, [user]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (name.includes(".")) {
			// Handle nested properties like preferences.emailNotifications
			const [parent, child] = name.split(".");
			setFormData({
				...formData,
				[parent]: {
					...formData[parent],
					[child]: type === "checkbox" ? checked : value,
				},
			});
		} else {
			setFormData({
				...formData,
				[name]: type === "checkbox" ? checked : value,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (updateProfile) {
				await updateProfile(formData);
			}
			setIsEditing(false);
			// In a real app, this would save to the backend
			alert("Profile updated successfully!");
		} catch (error) {
			console.error("Error updating profile:", error);
			alert("Failed to update profile. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Show loading state while user data is being fetched
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
				<div className="text-center">
					<div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
					<p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
						Loading profile...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<header className="bg-white dark:bg-gray-800 shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
					<div className="flex items-center">
						<Link href="/dashboard" className="flex items-center">
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
						</Link>
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
							<span>{formData.quackCoins} QuackCoins</span>
						</span>
					</div>
				</div>
			</header>

			{/* Main content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="md:flex md:items-center md:justify-between mb-6">
					<div className="flex-1 min-w-0">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							Your Profile
						</h2>
					</div>
					<div className="mt-4 flex md:mt-0 md:ml-4">
						<Link
							href="/dashboard"
							className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
						>
							<svg
								className="mr-2 -ml-1 h-5 w-5 text-gray-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Back to Dashboard
						</Link>
					</div>
				</div>

				<div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
					{!isEditing ? (
						<div>
							<div className="px-4 py-5 sm:px-6 flex justify-between items-center">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
										Profile Information
									</h3>
									<p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
										Personal details and preferences
									</p>
								</div>
								<button
									type="button"
									onClick={() => setIsEditing(true)}
									className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
								>
									<svg
										className="-ml-0.5 mr-2 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
										/>
									</svg>
									Edit
								</button>
							</div>
							<div className="border-t border-gray-200 dark:border-gray-700">
								<dl>
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Full name
										</dt>
										<dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
											{formData.name}
										</dd>
									</div>
									<div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Email address
										</dt>
										<dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
											{formData.email}
										</dd>
									</div>
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Major
										</dt>
										<dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
											{formData.major}
										</dd>
									</div>
									<div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Year
										</dt>
										<dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
											{formData.year}
										</dd>
									</div>
									<div className="bg-gray-50 dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Bio
										</dt>
										<dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
											{formData.bio}
										</dd>
									</div>
									<div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
										<dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
											Preferences
										</dt>
										<dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
											<ul className="space-y-2">
												<li>
													Email notifications:{" "}
													{formData.preferences
														.emailNotifications
														? "Enabled"
														: "Disabled"}
												</li>
												<li>
													Assignment reminders:{" "}
													{
														formData.preferences
															.reminderTime
													}{" "}
													days before deadline
												</li>
												<li>
													Dark mode:{" "}
													{formData.preferences
														.darkMode
														? "Enabled"
														: "Disabled"}
												</li>
											</ul>
										</dd>
									</div>
								</dl>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							{/* Form content remains the same */}
							{/* ... */}
							<div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6 flex justify-end space-x-3">
								<button
									type="button"
									onClick={() => setIsEditing(false)}
									className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
									disabled={isLoading}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
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
											Saving...
										</>
									) : (
										"Save"
									)}
								</button>
							</div>
						</form>
					)}
				</div>
			</main>
		</div>
	);
}
