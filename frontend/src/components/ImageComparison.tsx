"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ImageComparisonProps {
	leftImage: string;
	rightImage: string;
}

const ImageComparison: React.FC<ImageComparisonProps> = ({
	leftImage,
	rightImage,
}) => {
	const [sliderPosition, setSliderPosition] = useState<number>(50);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const container = containerRef.current;
		if (!container) return;

		const containerRect = container.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const mouseX = e.clientX - containerRect.left;
		const newPosition = (mouseX / containerWidth) * 100;

		setSliderPosition(Math.max(0, Math.min(100, newPosition)));
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (e.buttons === 1) {
				handleMove(e as unknown as React.MouseEvent<HTMLDivElement>);
			}
		};

		container.addEventListener(
			"mousedown",
			handleMove as unknown as EventListener,
		);
		container.addEventListener("mousemove", handleMouseMove);

		return () => {
			container.removeEventListener(
				"mousedown",
				handleMove as unknown as EventListener,
			);
			container.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative w-full h-[800px] overflow-hidden cursor-col-resize"
		>
			<Image
				width={500}
				height={300}
				src={leftImage}
				alt="Left"
				className="absolute top-0 left-0 w-full h-full object-cover"
			/>
			<div
				className="absolute top-0 right-0 w-full h-full overflow-hidden"
				style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
			>
				<Image
					width={500}
					height={300}
					src={rightImage}
					alt="Right"
					className="absolute top-0 left-0 w-full h-full object-cover"
				/>
			</div>
			<div
				className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize"
				style={{ left: `${sliderPosition}%` }}
			/>
			<div
				className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-col-resize"
				style={{ left: `calc(${sliderPosition}% - 1rem)` }}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<title>Drag</title>
					<polyline points="15 18 9 12 15 6" />
					<polyline points="9 18 3 12 9 6" />
				</svg>
			</div>
		</div>
	);
};

export default ImageComparison;
