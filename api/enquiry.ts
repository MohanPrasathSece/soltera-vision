import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, message } = req.body || {};

  // Server-side validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required" });
  }
  if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
    return res.status(400).json({ error: "A valid phone number is required" });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  // Split name into first and last name
  const nameParts = cleanName.split(/\s+/);
  const first_name = nameParts[0] || "";
  const last_name = nameParts.slice(1).join(" ") || "";

  try {
    const crmUrl =
      process.env.CRM_API_URL || "https://inwo.crmcore.me/api/lead_management/api/affiliates";
    const crmToken = process.env.CRM_AUTH_TOKEN || "AFF_1_92cbc1bc76284e19b711bab22587d75f";

    const crmPayload = {
      country_name: "cy",
      description: cleanMessage,
      phone: cleanPhone,
      email: cleanEmail,
      first_name,
      last_name,
      custom_fields: {
        Source_ID: "Website",
        Outline_Your_Case: cleanMessage,
      },
    };

    const crmResponse = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${crmToken}`,
      },
      body: JSON.stringify(crmPayload),
    });

    if (crmResponse.ok) {
      return res.status(200).json({
        success: true,
        message: "Thank you! Your enquiry has been received successfully.",
      });
    } else {
      const errText = await crmResponse.text();
      console.error(`CRM responded with status ${crmResponse.status}: ${errText}`);
      return res.status(crmResponse.status).json({
        error: "Failed to submit enquiry to CRM. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return res.status(500).json({
      error: "An error occurred during submission. Please try again.",
    });
  }
}
