import { Resend } from "resend";

// Initialize using your Resend API key
const resend = new Resend(process.env.RESEND_API_KEYclear);

export async function sendTestEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "streetunics@gmail.com",
      subject: "Hello World",
      html: "<p>Congrats on sending your <strong>first email</strong> through Streetunics SaaS!</p>",
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Catch error:", err);
    return { success: false, error: err.message };
  }
}
