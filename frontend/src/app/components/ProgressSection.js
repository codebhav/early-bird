// src/components/ProgressSection.js
"use client";

import { useState } from "react";
import DuckProgress from "./DuckProgress";

export default function ProgressSection({ assignments }) {
	// Calculate overall progress based on all assignments
	const calculateOverallProgress = () => {
		if (!assignments || assignments.length === 0) return 0;

		const completedCount = assignments.filter((a) => a.completed).length;
		return Math.round((completedCount / assignments.length) * 100);
	};

	// Get assignments sorted by deadline (closest first)
	const getSortedAssignments = () => {
		if (!assignments || assignments.length === 0) return [];

		return [...assignments].sort((a, b) => {
			if (a.completed && !b.completed) return 1;
			if (!a.completed && b.completed) return -1;
			return new Date(a.deadline) - new Date(b.deadline);
		});
	};

	// Calculate time metrics
	const calculateTimeMetrics = () => {
		if (!assignments || assignments.length === 0) {
			return {
				completedEarly: 0,
				totalAssignments: 0,
				earlyPercentage: 0,
			};
		}

		const completed = assignments.filter((a) => a.completed);
		const completedEarly = completed.filter((a) => {
			const deadline = new Date(a.deadline);
			const completedDate = new Date(a.completedDate || new Date());
			return completedDate < deadline;
		});

		return {
			completedEarly: completedEarly.length,
			totalCompleted: completed.length,
			earlyPercentage: completed.length
				? Math.round((completedEarly.length / completed.length) * 100)
				: 0,
		};
	};

	const overallProgress = calculateOverallProgress();
	const sortedAssignments = getSortedAssignments();
	const timeMetrics = calculateTimeMetrics();

	return (
		<div>
			<div className="mb-6">
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
					Overall Progress
				</h3>
				<div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
					<div className="mb-4">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
							{overallProgress}% of assignments completed
						</p>
						<DuckProgress progress={overallProgress} height={16} />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
						<div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
							<p className="text-sm text-gray-600 dark:text-gray-300">
								Total Assignments
							</p>
							<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								{assignments.length}
							</p>
						</div>

						<div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
							<p className="text-sm text-gray-600 dark:text-gray-300">
								Completed Early
							</p>
							<p className="text-2xl font-bold text-green-600 dark:text-green-400">
								{timeMetrics.completedEarly}
							</p>
						</div>

						<div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
							<p className="text-sm text-gray-600 dark:text-gray-300">
								Early Completion Rate
							</p>
							<p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								{timeMetrics.earlyPercentage}%
							</p>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
					Assignment Timeline
				</h3>
				<div className="space-y-4">
					{sortedAssignments.map((assignment) => {
						// Calculate percentage of time elapsed
						const startDate = new Date(assignment.startDate);
						const deadline = new Date(assignment.deadline);
						const today = new Date();
						const totalDuration = deadline - startDate;
						const elapsed = today - startDate;
						const timeProgress = Math.min(
							100,
							Math.max(0, (elapsed / totalDuration) * 100)
						);

						return (
							<div
								key={assignment.id}
								className="flex items-center space-x-4"
							>
								<div className="flex-shrink-0 w-16">
									<span className="text-sm text-gray-500 dark:text-gray-400">
										{new Date(
											assignment.deadline
										).toLocaleDateString(undefined, {
											month: "short",
											day: "numeric",
										})}
									</span>
								</div>

								<div className="flex-grow">
									<div className="flex justify-between items-center mb-1">
										<span className="text-sm font-medium text-gray-900 dark:text-white truncate">
											{assignment.title}
										</span>
										<span
											className={`text-xs px-2 py-1 rounded-full ${
												assignment.completed
													? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
													: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
											}`}
										>
											{assignment.completed
												? "Completed"
												: `${Math.round(
														timeProgress
												  )}% of time used`}
										</span>
									</div>
									<div className="w-full">
										<DuckProgress
											progress={
												assignment.completed
													? 100
													: timeProgress
											}
										/>
									</div>
								</div>
							</div>
						);
					})}

					{sortedAssignments.length === 0 && (
						<div className="text-center py-8 text-gray-500 dark:text-gray-400">
							No assignments found. Start adding assignments to
							see your progress!
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
