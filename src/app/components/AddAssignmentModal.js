// src/app/components/AddAssignmentModal.js
"use client";

import { useState } from "react";
import api from "@/app/utils/api";

export default function AddAssignmentModal({
	isOpen,
	onClose,
	onAssignmentAdded,
}) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		course: "",
		startDate: new Date().toISOString().split("T")[0],
		deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		estimatedHours: 5,
		coinsReward: 20,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	if (!isOpen) return null;

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData({
			...formData,
			[name]: type === "number" ? parseFloat(value) : value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			// In a real app, this would use the API
			const response = await api.createAssignment(formData);

			onAssignmentAdded(response.assignment);
			onClose();
		} catch (error) {
			console.error("Error adding assignment:", error);
			setError(
				error.message || "Failed to add assignment. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// For demo purposes, we'll simulate the API call
	const handleDemoSubmit = (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Generate a simple ID for the mock assignment
		const newAssignment = {
			...formData,
			id: Date.now(),
			completed: false,
		};

		// Simulate API delay
		setTimeout(() => {
			onAssignmentAdded(newAssignment);
			onClose();
			setIsSubmitting(false);
		}, 1000);
	};

	return (
		<div
			className="fixed inset-0 z-50 overflow-y-auto"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				{/* Background overlay */}
				<div
					className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
					aria-hidden="true"
					onClick={onClose}
				></div>

				{/* Modal panel */}
				<div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div className="sm:flex sm:items-start">
							<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
								<h3
									className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
									id="modal-title"
								>
									Add New Assignment
								</h3>

								{error && (
									<div className="mt-2 p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm">
										{error}
									</div>
								)}

								<form
									onSubmit={
										process.env.NODE_ENV === "production"
											? handleSubmit
											: handleDemoSubmit
									}
									className="mt-4"
								>
									<div className="space-y-4">
										<div>
											<label
												htmlFor="title"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300"
											>
												Title *
											</label>
											<input
												type="text"
												name="title"
												id="title"
												required
												value={formData.title}
												onChange={handleChange}
												className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
											/>
										</div>

										<div>
											<label
												htmlFor="description"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300"
											>
												Description
											</label>
											<textarea
												name="description"
												id="description"
												rows="3"
												value={formData.description}
												onChange={handleChange}
												className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
											></textarea>
										</div>

										<div>
											<label
												htmlFor="course"
												className="block text-sm font-medium text-gray-700 dark:text-gray-300"
											>
												Course
											</label>
											<input
												type="text"
												name="course"
												id="course"
												value={formData.course}
												onChange={handleChange}
												className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
											/>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<label
													htmlFor="startDate"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300"
												>
													Start Date *
												</label>
												<input
													type="date"
													name="startDate"
													id="startDate"
													required
													value={formData.startDate}
													onChange={handleChange}
													className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
												/>
											</div>

											<div>
												<label
													htmlFor="deadline"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300"
												>
													Deadline *
												</label>
												<input
													type="date"
													name="deadline"
													id="deadline"
													required
													value={formData.deadline}
													onChange={handleChange}
													className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div>
												<label
													htmlFor="estimatedHours"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300"
												>
													Estimated Hours
												</label>
												<input
													type="number"
													min="0.5"
													step="0.5"
													name="estimatedHours"
													id="estimatedHours"
													value={
														formData.estimatedHours
													}
													onChange={handleChange}
													className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
												/>
											</div>

											<div>
												<label
													htmlFor="coinsReward"
													className="block text-sm font-medium text-gray-700 dark:text-gray-300"
												>
													QuackCoins Reward
												</label>
												<input
													type="number"
													min="5"
													step="5"
													name="coinsReward"
													id="coinsReward"
													value={formData.coinsReward}
													onChange={handleChange}
													className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
												/>
											</div>
										</div>
									</div>

									<div className="mt-6 flex justify-end space-x-3">
										<button
											type="button"
											onClick={onClose}
											className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										>
											Cancel
										</button>
										<button
											type="submit"
											disabled={isSubmitting}
											className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isSubmitting ? (
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
											) : null}
											Add Assignment
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
