import { withErrorHandler } from "@/middleware/error.middleware";
import Contact from "@/models/Contact";
import dbConnect from "@/lib/dbConnect";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";

export const POST = withErrorHandler(async (req) => {
  await dbConnect();
  const { name, email, phone, subject, message } = await req.json();

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required fields.");
  }

  const contact = await Contact.create({
    name,
    email: email.toLowerCase().trim(),
    phone: phone || "",
    subject: subject || "",
    message,
    status: "New",
  });

  return ApiResponse.created(contact, "Your inquiry has been submitted successfully.");
});
