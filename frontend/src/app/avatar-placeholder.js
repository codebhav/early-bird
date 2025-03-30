// src/app/avatar-placeholder.js
export default function AvatarPlaceholder({
	name = "User",
	size = 40,
	fontSize = 16,
}) {
	// Generate a random background color based on the name
	const getBackgroundColor = (name) => {
		const colors = [
			"#F87171", // red
			"#FB923C", // orange
			"#FBBF24", // amber
			"#A3E635", // lime
			"#34D399", // emerald
			"#22D3EE", // cyan
			"#60A5FA", // blue
			"#A78BFA", // violet
			"#F472B6", // pink
		];

		// Use name to deterministically select a color
		const sum = name
			.split("")
			.reduce((acc, char) => acc + char.charCodeAt(0), 0);
		return colors[sum % colors.length];
	};

	// Get initials from name
	const getInitials = (name) => {
		if (!name) return "?";

		const parts = name.split(" ").filter(Boolean);
		if (parts.length === 0) return "?";

		if (parts.length === 1) {
			return parts[0].charAt(0).toUpperCase();
		}

		return (
			parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
		).toUpperCase();
	};

	const backgroundColor = getBackgroundColor(name);
	const initials = getInitials(name);

	return (
		<div
			style={{
				backgroundColor,
				width: `${size}px`,
				height: `${size}px`,
				fontSize: `${fontSize}px`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				borderRadius: "50%",
				color: "#FFFFFF",
				fontWeight: "bold",
			}}
			aria-label={`Avatar for ${name}`}
		>
			{initials}
		</div>
	);
}
