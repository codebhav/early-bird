// src/app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/app/components/AppLayout";
import AssignmentCard from "@/app/components/AssignmentCard";
import ProgressSection from "@/app/components/ProgressSection";
import Leaderboard from "@/app/components/Leaderboard";
import AddAssignmentModal from "@/app/components/AddAssignmentModal";
import { useAuth } from "@/app/contexts/AuthContext";
import api from "@/app/utils/api";
import { mockAssignments, mockFriends } from "@/app/data/mockData";

export default function Dashboard() {
	const { user } = useAuth();
	const [assignments, setAssignments] = useState([]);
	const [friends, setFriends] = useState([]);
	const [activeTab, setActiveTab] = useState("progress");
	const [isLoading, setIsLoading] = useState(true);
	const [showAddModal, setShowAddModal] = useState(false);

	// Fetch assignments and friends (mock data for demo)
	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);

				// In a real app, this would use the API
				// const assignmentsResponse = await api.getAssignments();
				// const friendsResponse = await api.getFriends();

				// For demo purposes, we'll use mock data
				setTimeout(() => {
					setAssignments(mockAssignments);
					setFriends(mockFriends);
					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching data:", error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Handle assignment completion
	const handleCompleteAssignment = async (assignmentId) => {
		try {
			// In a real app, this would use the API
			// const response = await api.completeAssignment(assignmentId);

			// For demo, we'll update the local state
			setAssignments(
				assignments.map((assignment) =>
					assignment.id === assignmentId
						? {
								...assignment,
								completed: true,
								completedDate: new Date().toISOString(),
						  }
						: assignment
				)
			);

			// Update user QuackCoins (mock implementation)
			const completedAssignment = assignments.find(
				(a) => a.id === assignmentId
			);
			if (completedAssignment && user) {
				// Refresh user data with updated coins in a real app
				// await refreshUser();
			}
		} catch (error) {
			console.error("Error completing assignment:", error);
		}
	};

	// Handle adding a new assignment
	const handleAddAssignment = (newAssignment) => {
		setAssignments([...assignments, newAssignment]);
	};

	return (
		<AppLayout>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
					Your Assignments
				</h2>

				<button
					onClick={() => setShowAddModal(true)}
					className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					aria-label="Add new assignment"
				>
					<svg
						className="-ml-1 mr-2 h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
							clipRule="evenodd"
						/>
					</svg>
					Add Assignment
				</button>
			</div>

			{/* Add Assignment Modal */}
			<AddAssignmentModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onAssignmentAdded={handleAddAssignment}
			/>

			{/* Assignment cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{isLoading ? (
					<div className="col-span-full flex justify-center items-center py-12 text-gray-500 dark:text-gray-400">
						<svg
							className="animate-spin -ml-1 mr-3 h-5 w-5"
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
						Loading assignments...
					</div>
				) : assignments.length > 0 ? (
					assignments.map((assignment) => (
						<AssignmentCard
							key={assignment.id}
							assignment={assignment}
							onComplete={() =>
								handleCompleteAssignment(assignment.id)
							}
						/>
					))
				) : (
					<div className="col-span-full text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
						<div className="flex flex-col items-center">
							<svg
								className="h-12 w-12 text-gray-400 mb-4"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
								No assignments yet
							</h3>
							<p className="text-gray-500 dark:text-gray-400 mb-4">
								Get started by adding your first assignment
							</p>
							<button
								onClick={() => setShowAddModal(true)}
								className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
							>
								<svg
									className="-ml-1 mr-2 h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fillRule="evenodd"
										d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
										clipRule="evenodd"
									/>
								</svg>
								Add Assignment
							</button>
						</div>
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
								activeTab === "progress" ? "page" : undefined
							}
							aria-label="View progress statistics"
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
								activeTab === "leaderboard" ? "page" : undefined
							}
							aria-label="View leaderboard"
						>
							Leaderboard
						</button>
					</nav>
				</div>

				<div className="p-6">
					{activeTab === "progress" ? (
						<ProgressSection assignments={assignments} />
					) : (
						<Leaderboard friends={friends} user={user || {}} />
					)}
				</div>
			</div>
		</AppLayout>
	);
}
