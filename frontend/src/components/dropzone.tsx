"use client";

import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import { useEffect, useState } from "react";
import ReactCompareImage from "react-compare-image";

interface DropzoneFile extends File {
	previewElement: HTMLElement;
	previewTemplate: HTMLElement;
	previewsContainer: HTMLElement;
	status: string;
	accepted: boolean;
}

export const DropZone: React.FC = () => {
	const [originalImage, setOriginalImage] = useState<string | null>(null);
	const [processedImage, setProcessedImage] = useState<string | null>(null);
	const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);

	useEffect(() => {
		const myDropzone = new Dropzone("#dropzone", {
			url: "/api/upload",
			acceptedFiles: "image/*",
			maxFiles: 1,
			autoProcessQueue: false,
		});

		myDropzone.on("addedfile", async (file: DropzoneFile) => {
			setOriginalImage(URL.createObjectURL(file));
			const formData = new FormData();
			formData.append("file", file);

			try {
				// Direct call to FastAPI server
				const response = await fetch(
					"http://localhost:8000/remove-background",
					{
						method: "POST",
						body: formData,
					},
				);

				if (response.ok) {
					const blob = await response.blob();
					setProcessedBlob(blob);
					const processedImageUrl = URL.createObjectURL(blob);
					setProcessedImage(processedImageUrl);
				} else {
					console.error("Failed to process image");
				}
			} catch (error) {
				console.error("Error processing image:", error);
			}
		});

		return () => {
			myDropzone.destroy();
		};
	}, []);

	const handleDownload = () => {
		if (processedBlob) {
			const url = window.URL.createObjectURL(processedBlob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "processed_image.png");
			document.body.appendChild(link);
			link.click();
			link.parentNode?.removeChild(link);
		}
	};

	return (
		<main className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Background Remover</h1>
			<div
				id="dropzone"
				className="border-2 border-dashed border-gray-300 p-4 mb-4"
			>
				<p>Drag and drop an image here, or click to select a file</p>
			</div>
			{originalImage && processedImage && (
				<>
					<ReactCompareImage
						leftImage={originalImage}
						rightImage={processedImage}
						sliderLineColor="#000"
						sliderLineWidth={2}
						sliderPositionPercentage={0.5}
					/>
					<button
						type="button"
						onClick={handleDownload}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
					>
						Download Processed Image
					</button>
				</>
			)}
		</main>
	);
};
