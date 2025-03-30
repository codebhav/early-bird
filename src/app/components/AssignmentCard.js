// src/app/components/AssignmentCard.js
"use client";

import { useState } from "react";
import DuckProgress from "./DuckProgress";

export default function AssignmentCard({ assignment, onComplete }) {
	const [showDetails, setShowDetails] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Calculate days left until deadline
	const today = new Date();
	const deadline = new Date(assignment.deadline);
	const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

	// Calculate progress percentage based on time
	const startDate = new Date(assignment.startDate);
	const totalDuration = deadline - startDate;
	const elapsed = today - startDate;
	const rawProgress = Math.min(
		100,
		Math.max(0, (elapsed / totalDuration) * 100)
	);

	// Adjust progress if assignment is completed
	const progress = assignment.completed ? 100 : rawProgress;

	// Determine card status color and text
	const getStatusColor = () => {
		if (assignment.completed)
			return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
		if (daysLeft <= 1)
			return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
		if (daysLeft <= 3)
			return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
		return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
	};

	const getStatusText = () => {
		if (assignment.completed) return "Completed";
		if (daysLeft <= 0) return "Due today!";
		if (daysLeft === 1) return "1 day left";
		return `${daysLeft} days left`;
	};

	// Handle marking assignment as complete
	const handleComplete = async () => {
		if (assignment.completed || isSubmitting) return;

		setIsSubmitting(true);
		try {
			await onComplete(assignment.id);
		} catch (error) {
			console.error("Error completing assignment:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
			id={`assignment-${assignment.id}`}
		>
			<div className="p-5">
				<div className="flex justify-between items-start mb-3">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						{assignment.title}
					</h3>
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
						aria-label={`Status: ${getStatusText()}`}
					>
						{getStatusText()}
					</span>
				</div>

				<p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
					{assignment.description}
				</p>

				<div className="mb-4">
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
						Progress {Math.round(progress)}%
					</p>
					<DuckProgress
						progress={progress}
						aria-label={`Assignment progress: ${Math.round(
							progress
						)}%`}
					/>
				</div>

				<div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
					<div>{assignment.course}</div>
					<div className="flex items-center">
						<svg
							className="h-4 w-4 mr-1"
							fill="currentColor"
							viewBox="0 0 20 20"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
								clipRule="evenodd"
							/>
						</svg>
						<span aria-label="Deadline">
							{new Date(assignment.deadline).toLocaleDateString(
								undefined,
								{
									year: "numeric",
									month: "short",
									day: "numeric",
								}
							)}
						</span>
					</div>
				</div>

				<button
					onClick={() => setShowDetails(!showDetails)}
					className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2"
					aria-expanded={showDetails}
					aria-controls={`details-${assignment.id}`}
				>
					{showDetails ? "Hide details" : "Show details"}
					<svg
						className={`ml-1 h-4 w-4 transform transition-transform ${
							showDetails ? "rotate-180" : ""
						}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>

				{showDetails && (
					<div
						id={`details-${assignment.id}`}
						className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
					>
						<div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
							<p>
								<span className="font-medium">Assigned:</span>{" "}
								{new Date(
									assignment.startDate
								).toLocaleDateString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</p>
							<p>
								<span className="font-medium">
									Estimated time:
								</span>{" "}
								{assignment.estimatedHours} hours
							</p>
							<p>
								<span className="font-medium">
									Reward potential:
								</span>{" "}
								{assignment.coinsReward} QuackCoins
							</p>

							{!assignment.completed && (
								<button
									className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
									onClick={handleComplete}
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
											Completing...
										</>
									) : (
										"Mark as Complete"
									)}
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
