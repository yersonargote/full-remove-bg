/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return [
			{
				source: "/api/remove-background",
				destination: "http://localhost:8000/remove-background",
			},
		];
	},
};

export default nextConfig;
