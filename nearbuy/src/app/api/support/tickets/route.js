import { withErrorHandler } from "@/middleware/error.middleware";
import supportController from "@/controllers/support.controller";

export const POST = withErrorHandler(async (req) => {
  return await supportController.createTicket(req);
});

export const GET = withErrorHandler(async (req) => {
  return await supportController.getTickets(req);
});
