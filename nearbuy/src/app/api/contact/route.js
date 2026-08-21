import { withErrorHandler } from "@/middleware/error.middleware";
import Contact from "@/models/Contact";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { sendEmail } from "@/utils/nodemailer";

export const POST = withErrorHandler(async (req) => {
  await dbConnect();
  const body = await req.json();
  const { name, email, phone, subject, message, enquiryType } = body;

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required fields.");
  }

  // Determine if this is a vendor onboarding request or a general inquiry
  const isVendorOnboarding = subject?.includes("Store Onboarding");

  // Save submission matching your schema constraints
  const contact = await Contact.create({
    name,
    email: email.toLowerCase().trim(),
    phone: phone || "",
    subject:
      subject ||
      (isVendorOnboarding ? "Store Onboarding Request" : "General Inquiry"),
    message,
    enquiryType: isVendorOnboarding ? "VENDOR" : enquiryType || "GENERAL",
    source: "WEBSITE",
    status: "NEW",
  });

  // Optional: Trigger email notification to your support inbox
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #0f172a; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #2563eb; margin-top: 0;">New ${isVendorOnboarding ? "Store Onboarding" : "Website Enquiry"} - Streetunics</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <div style="margin-top: 20px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
          <p style="font-weight: bold; margin-top: 0;">Message / Details:</p>
          <p style="white-space: pre-wrap; margin-bottom: 0;">${message}</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: process.env.SMTP_USER || "streetunics@gmail.com",
      subject: `[Streetunics] ${contact.subject} from ${name}`,
      html: emailHtml,
      text: `New submission from ${name} (${email}): ${message}`,
    });
  } catch (emailErr) {
    console.error("Email dispatch failed:", emailErr.message);
  }

  return ApiResponse.created(
    contact,
    "Your inquiry has been submitted successfully.",
  );
});
