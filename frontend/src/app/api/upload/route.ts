import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		// This is just a placeholder. The actual upload will be handled by Dropzone.
		res.status(200).json({ message: "File uploaded successfully" });
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
