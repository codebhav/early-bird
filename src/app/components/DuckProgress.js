// src/app/components/DuckProgress.js
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function DuckProgress({
	progress = 0,
	height = 12,
	id,
	...props
}) {
	const progressBarRef = useRef(null);
	const duckRef = useRef(null);
	const uniqueId =
		id || `duck-progress-${Math.random().toString(36).substring(2, 10)}`;

	useEffect(() => {
		if (progressBarRef.current && duckRef.current) {
			// Calculate duck position based on progress percentage
			const barWidth = progressBarRef.current.offsetWidth;
			const duckWidth = duckRef.current.offsetWidth;

			// Adjust progress to account for duck width
			const adjustedProgress =
				(progress * (barWidth - duckWidth)) / barWidth;

			// Set the duck position
			const position = Math.min(100, Math.max(0, adjustedProgress));
			duckRef.current.style.left = `${position}%`;
		}
	}, [progress]);

	return (
		<div
			className="relative w-full"
			aria-valuemin="0"
			aria-valuemax="100"
			aria-valuenow={Math.round(progress)}
			role="progressbar"
			id={uniqueId}
			{...props}
		>
			{/* Progress bar background */}
			<div
				ref={progressBarRef}
				className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
				style={{ height: `${height}px` }}
			>
				{/* Progress fill */}
				<div
					className="bg-blue-500 h-full transition-all duration-500 ease-out rounded-full"
					style={{ width: `${progress}%` }}
				/>
			</div>

			{/* Duck character */}
			<div
				ref={duckRef}
				className="absolute top-0 transform -translate-y-1/3 transition-all duration-500"
				style={{
					height: `${height * 2.5}px`,
					width: `${height * 2.5}px`,
				}}
				aria-hidden="true"
			>
				<Image
					src="/duck-character.svg"
					alt=""
					width={height * 2.5}
					height={height * 2.5}
					className={
						progress === 100 ? "duck-celebrate" : "duck-waddle"
					}
				/>
			</div>

			{/* Visually hidden text for screen readers */}
			<span className="sr-only">
				{progress === 100
					? "Completed! 100% progress"
					: `${Math.round(progress)}% progress`}
			</span>

			{/* CSS for duck animations */}
			<style jsx global>{`
				.duck-waddle {
					animation: waddle 1s infinite alternate;
				}

				.duck-celebrate {
					animation: celebrate 1s infinite;
				}

				@keyframes waddle {
					0% {
						transform: rotate(-5deg) translateY(0);
					}
					100% {
						transform: rotate(5deg) translateY(-2px);
					}
				}

				@keyframes celebrate {
					0% {
						transform: translateY(0) scale(1);
					}
					50% {
						transform: translateY(-10px) scale(1.1);
					}
					100% {
						transform: translateY(0) scale(1);
					}
				}
			`}</style>
		</div>
	);
}
