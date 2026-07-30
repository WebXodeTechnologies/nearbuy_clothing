import supportRepository from "@/repositories/support.repository";
import vendorRepository from "@/repositories/vendor.repository";
import ApiError from "@/utils/apiError";

class SupportService {
  async createTicket(ownerId, ticketData) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw ApiError.notFound(
        "Vendor profile required to submit support tickets.",
      );
    }

    const count = await supportRepository.countTotal();
    const ticketId = `TK-${1000 + count + 1}`;

    return await supportRepository.create({
      ...ticketData,
      ticketId,
      vendorId: vendor._id,
    });
  }

  async getVendorTickets(ownerId) {
    const vendor = await vendorRepository.findByOwnerId(ownerId);
    if (!vendor) {
      throw ApiError.notFound("Vendor profile not found.");
    }

    return await supportRepository.findByVendorId(vendor._id);
  }
}

const supportService = new SupportService();
export default supportService;
