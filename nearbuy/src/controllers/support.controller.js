import { requireVendor } from "@/middleware/vendor.middleware";
import { validate } from "@/middleware/validate.middleware";
import { supportTicketSchema } from "@/validations/support.schema";
import supportService from "@/services/support.service";
import dbConnect from "@/lib/db";
import ApiResponse from "@/utils/apiResponse";

class SupportController {
  async createTicket(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const body = await req.json();
    const validatedData = validate(supportTicketSchema, body);

    const ticket = await supportService.createTicket(user.id, validatedData);

    return ApiResponse.created(ticket, "Support ticket created successfully");
  }

  async getTickets(req) {
    const user = await requireVendor(req);
    await dbConnect();

    const tickets = await supportService.getVendorTickets(user.id);

    return ApiResponse.success(tickets, "Tickets retrieved successfully");
  }
}

const supportController = new SupportController();
export default supportController;
