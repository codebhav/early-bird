// src/data/mockData.js

// Sample assignments
export const mockAssignments = [
	{
		id: 1,
		title: "Research Paper: Renewable Energy",
		description:
			"Write a 10-page research paper on the current state and future of renewable energy sources. Include at least 8 peer-reviewed sources.",
		course: "Environmental Science 301",
		startDate: "2025-03-10",
		deadline: "2025-04-12",
		completed: false,
		estimatedHours: 15,
		coinsReward: 50,
	},
	{
		id: 2,
		title: "Problem Set 3: Algorithms",
		description:
			"Complete problems 1-15 in Chapter 7 covering graph algorithms and dynamic programming techniques.",
		course: "CS 332",
		startDate: "2025-03-15",
		deadline: "2025-03-31",
		completed: false,
		estimatedHours: 8,
		coinsReward: 30,
	},
	{
		id: 3,
		title: "Group Project: Marketing Analysis",
		description:
			"Work with your assigned group to analyze the marketing strategy of a Fortune 500 company and present your findings.",
		course: "Marketing 250",
		startDate: "2025-03-01",
		deadline: "2025-04-05",
		completed: false,
		estimatedHours: 20,
		coinsReward: 75,
	},
	{
		id: 4,
		title: "Lab Report: Titration Experiment",
		description:
			"Write a detailed report on the acid-base titration experiment performed in lab session 5.",
		course: "Chemistry 202",
		startDate: "2025-03-22",
		deadline: "2025-04-3",
		completed: false,
		estimatedHours: 5,
		coinsReward: 25,
	},
	{
		id: 5,
		title: "Reading Response: Shakespeare",
		description:
			'Write a 3-page response to the assigned reading of "Hamlet" focusing on themes of indecision and moral ambiguity.',
		course: "English Literature 204",
		startDate: "2025-03-05",
		deadline: "2025-03-20",
		completed: true,
		completedDate: "2025-03-18",
		estimatedHours: 6,
		coinsReward: 20,
	},
];

// Sample friends for leaderboard
export const mockFriends = [
	{
		name: "Alex Johnson",
		email: "alex.j@example.com",
		quackCoins: 215,
		avatar: "https://i.pravatar.cc/150?img=1",
		stats: {
			completed: 12,
			earlyRate: 83,
			avgTime: 4.2,
			comparison: "Completes assignments 27% faster than average",
		},
	},
	{
		name: "Taylor Smith",
		email: "taylor.s@example.com",
		quackCoins: 180,
		avatar: "https://i.pravatar.cc/150?img=5",
		stats: {
			completed: 10,
			earlyRate: 70,
			avgTime: 5.1,
			comparison: "Gets started 2 days earlier than most students",
		},
	},
	{
		name: "Jordan Lee",
		email: "jordan.l@example.com",
		quackCoins: 145,
		avatar: "https://i.pravatar.cc/150?img=8",
		stats: {
			completed: 8,
			earlyRate: 62,
			avgTime: 5.8,
			comparison: "Earned 45 QuackCoins in the last week",
		},
	},
	{
		name: "Morgan Chen",
		email: "morgan.c@example.com",
		quackCoins: 90,
		avatar: "https://i.pravatar.cc/150?img=9",
		stats: {
			completed: 6,
			earlyRate: 50,
			avgTime: 6.3,
			comparison: "Improving early completion rate by 12%",
		},
	},
];

// Algorithm for calculating QuackCoins
export const calculateQuackCoins = (assignment, completionDate) => {
	if (!assignment) return 0;

	// Base reward for completing the assignment
	let coins = assignment.coinsReward;

	// Convert dates to objects if they're strings
	const deadline =
		typeof assignment.deadline === "string"
			? new Date(assignment.deadline)
			: assignment.deadline;

	const startDate =
		typeof assignment.startDate === "string"
			? new Date(assignment.startDate)
			: assignment.startDate;

	const completionDateTime =
		typeof completionDate === "string"
			? new Date(completionDate)
			: completionDate;

	// Calculate total available time (in days)
	const totalDays = Math.floor(
		(deadline - startDate) / (1000 * 60 * 60 * 24)
	);

	// Calculate how many days before the deadline it was completed
	const daysBeforeDeadline = Math.floor(
		(deadline - completionDateTime) / (1000 * 60 * 60 * 24)
	);

	// Calculate time used as a percentage of total time
	const timeUsedPercentage = 1 - daysBeforeDeadline / totalDays;

	// Early completion bonus: more coins the earlier it's completed
	// Formulated to give maximum bonus for completing in first 25% of time
	// and decreasing bonus as it gets closer to deadline
	let earlyBonus = 0;

	if (timeUsedPercentage <= 0.25) {
		// Maximum bonus (50% of base reward) if completed in first quarter of time
		earlyBonus = assignment.coinsReward * 0.5;
	} else if (timeUsedPercentage <= 0.5) {
		// 30% bonus if completed in first half
		earlyBonus = assignment.coinsReward * 0.3;
	} else if (timeUsedPercentage <= 0.75) {
		// 15% bonus if completed in third quarter
		earlyBonus = assignment.coinsReward * 0.15;
	} else {
		// 5% bonus if completed in last quarter but before deadline
		earlyBonus = assignment.coinsReward * 0.05;
	}

	// Round the earlyBonus to nearest integer
	earlyBonus = Math.round(earlyBonus);

	// Total coins = base reward + early completion bonus
	return coins + earlyBonus;
};

// Algorithm for ranking users in the leaderboard
export const calculateUserRanking = (users) => {
	if (!users || users.length === 0) return [];

	// First, sort by QuackCoins (highest first)
	const sortedUsers = [...users].sort((a, b) => b.quackCoins - a.quackCoins);

	// Add ranking position
	return sortedUsers.map((user, index) => ({
		...user,
		rank: index + 1,
	}));
};
