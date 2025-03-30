// src/components/AssignmentCard.js
"use client";

import { useState } from "react";
import DuckProgress from "./DuckProgress";

export default function AssignmentCard({ assignment }) {
	const [showDetails, setShowDetails] = useState(false);

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

	// Determine card status color
	const getStatusColor = () => {
		if (assignment.completed) return "bg-green-100 dark:bg-green-900";
		if (daysLeft <= 1) return "bg-red-100 dark:bg-red-900";
		if (daysLeft <= 3) return "bg-yellow-100 dark:bg-yellow-900";
		return "bg-blue-100 dark:bg-blue-900";
	};

	const getStatusText = () => {
		if (assignment.completed) return "Completed";
		if (daysLeft <= 0) return "Due today!";
		if (daysLeft === 1) return "1 day left";
		return `${daysLeft} days left`;
	};

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
			<div className="p-5">
				<div className="flex justify-between items-start mb-3">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						{assignment.title}
					</h3>
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()} text-gray-800 dark:text-gray-200`}
					>
						{getStatusText()}
					</span>
				</div>

				<p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
					{assignment.description}
				</p>

				<div className="mb-4">
					<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
						Progress
					</p>
					<DuckProgress progress={progress} />
				</div>

				<div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
					<div>Course: {assignment.course}</div>
					<div className="flex items-center">
						<svg
							className="h-4 w-4 mr-1"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
								clipRule="evenodd"
							/>
						</svg>
						{new Date(assignment.deadline).toLocaleDateString()}
					</div>
				</div>

				<button
					onClick={() => setShowDetails(!showDetails)}
					className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
					aria-expanded={showDetails}
				>
					{showDetails ? "Hide details" : "Show details"}
					<svg
						className={`ml-1 h-4 w-4 transform transition-transform ${
							showDetails ? "rotate-180" : ""
						}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
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
					<div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
						<div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
							<p>
								<span className="font-medium">Assigned:</span>{" "}
								{new Date(
									assignment.startDate
								).toLocaleDateString()}
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
									className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
									onClick={(e) => {
										e.stopPropagation();
										alert(
											`In a real app, this would mark the assignment as completed and award ${assignment.coinsReward} QuackCoins!`
										);
									}}
								>
									Mark as Complete
								</button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
