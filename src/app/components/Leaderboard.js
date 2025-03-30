// src/components/Leaderboard.js
"use client";

import { useState } from "react";
import Image from "next/image";

export default function Leaderboard({ friends, user }) {
	const [tooltipUser, setTooltipUser] = useState(null);

	// Combine friends and current user data
	const allUsers = [...friends, { ...user, isCurrentUser: true }];

	// Sort by QuackCoins (highest first)
	const sortedUsers = [...allUsers].sort(
		(a, b) => b.quackCoins - a.quackCoins
	);

	// Add ranking information
	const rankedUsers = sortedUsers.map((user, index) => ({
		...user,
		rank: index + 1,
	}));

	// Show tooltip with user stats
	const showTooltip = (user) => {
		setTooltipUser(user);
	};

	// Hide tooltip
	const hideTooltip = () => {
		setTooltipUser(null);
	};

	// If no friends, show a message
	if (friends.length === 0) {
		return (
			<div className="text-center py-8">
				<div className="inline-block bg-yellow-100 dark:bg-yellow-900 p-6 rounded-full mb-4">
					<svg
						className="h-8 w-8 text-yellow-500"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 1.944A11.954 11.954 0 0 1 10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10c0-.656-.069-1.298-.202-1.92l-1.19 1.19a8 8 0 1 0-5.858-5.857l1.19-1.19A11.895 11.895 0 0 0 10 1.944zM15 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 5.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-7-5.75a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1.5 5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 0-1.5h-3.5a.75.75 0 0 0-.75.75z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
				<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
					No Friends Added Yet
				</h3>
				<p className="text-gray-500 dark:text-gray-400 mb-4">
					Add friends to see how you rank against them!
				</p>
				<button
					className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					onClick={() =>
						alert(
							"In a real app, this would open the friend invite dialog!"
						)
					}
				>
					<svg
						className="mr-2 h-4 w-4"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
					</svg>
					Add Friends
				</button>
			</div>
		);
	}

	return (
		<div>
			<h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
				QuackCoins Leaderboard
			</h3>

			<div className="relative overflow-hidden">
				<div className="bg-gray-50 dark:bg-gray-900 rounded-t-lg border-b border-gray-200 dark:border-gray-700 py-2 px-4">
					<div className="grid grid-cols-12 text-sm font-medium text-gray-500 dark:text-gray-400">
						<div className="col-span-1">Rank</div>
						<div className="col-span-7">Student</div>
						<div className="col-span-3 text-right">QuackCoins</div>
						<div className="col-span-1"></div>
					</div>
				</div>

				<div className="divide-y divide-gray-200 dark:divide-gray-700">
					{rankedUsers.map((user) => (
						<div
							key={user.email}
							className={`py-3 px-4 grid grid-cols-12 items-center ${
								user.isCurrentUser
									? "bg-blue-50 dark:bg-blue-900/20"
									: "hover:bg-gray-50 dark:hover:bg-gray-800/50"
							}`}
						>
							<div className="col-span-1">
								{user.rank <= 3 ? (
									<span
										className={`
                    flex items-center justify-center w-6 h-6 rounded-full 
                    ${
						user.rank === 1
							? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300"
							: ""
					}
                    ${
						user.rank === 2
							? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
							: ""
					}
                    ${
						user.rank === 3
							? "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
							: ""
					}
                  `}
									>
										{user.rank}
									</span>
								) : (
									<span className="text-gray-500 dark:text-gray-400 pl-2">
										{user.rank}
									</span>
								)}
							</div>

							<div className="col-span-7 flex items-center">
								<div className="relative w-8 h-8 mr-3 rounded-full overflow-hidden">
									<Image
										src={
											user.avatar ||
											"/avatar-placeholder.png"
										}
										alt={user.name}
										fill
										className="object-cover"
									/>
								</div>
								<span
									className={`font-medium ${
										user.isCurrentUser
											? "text-blue-600 dark:text-blue-400"
											: "text-gray-900 dark:text-white"
									}`}
								>
									{user.name} {user.isCurrentUser && "(You)"}
								</span>
							</div>

							<div className="col-span-3 text-right font-medium text-gray-900 dark:text-white">
								{user.quackCoins.toLocaleString()}
							</div>

							<div className="col-span-1 text-right relative">
								<button
									className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
									onMouseEnter={() => showTooltip(user)}
									onMouseLeave={hideTooltip}
									aria-label={`View statistics for ${user.name}`}
								>
									<svg
										className="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
											clipRule="evenodd"
										/>
									</svg>
								</button>

								{tooltipUser &&
									tooltipUser.email === user.email && (
										<div className="absolute z-10 right-0 w-64 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-left">
											<div className="text-sm">
												<h4 className="font-medium text-gray-900 dark:text-white mb-2">
													{user.name}'s Stats
												</h4>
												<div className="space-y-2 text-gray-600 dark:text-gray-300">
													<p>
														Assignments completed:{" "}
														{user.stats
															?.completed || "--"}
													</p>
													<p>
														Early completion rate:{" "}
														{user.stats
															?.earlyRate || "--"}
														%
													</p>
													<p>
														Average time to
														complete:{" "}
														{user.stats?.avgTime ||
															"--"}{" "}
														days
													</p>
													{user.stats?.comparison && (
														<p className="text-green-600 dark:text-green-400 mt-3 font-medium">
															{
																user.stats
																	.comparison
															}
														</p>
													)}
												</div>
											</div>
										</div>
									)}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mt-6 flex justify-center">
				<button
					className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					onClick={() =>
						alert(
							"In a real app, this would open the friend invite dialog!"
						)
					}
				>
					<svg
						className="mr-2 h-4 w-4"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
					</svg>
					Invite More Friends
				</button>
			</div>
		</div>
	);
}
