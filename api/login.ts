import { list } from "@vercel/blob";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required" });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      console.warn("BLOB_READ_WRITE_TOKEN is not set, using mock login.");
      // Fallback for development if token isn't in env yet
      return res.status(200).json({
        success: true,
        user: { email: cleanEmail, name: cleanEmail.split("@")[0] },
      });
    }

    const { blobs } = await list({
      prefix: `users/${cleanEmail}.json`,
      token,
    });

    if (blobs.length === 0) {
      return res.status(401).json({
        error: "This email is not registered. Please sign up to create an account.",
      });
    }

    return res.status(200).json({
      success: true,
      user: { email: cleanEmail },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Authentication service error. Please try again later.",
    });
  }
}
