import SupportTicket from "@/models/SupportTicket";

class SupportRepository {
  async create(ticketData) {
    return await SupportTicket.create(ticketData);
  }

  async findByVendorId(vendorId) {
    return await SupportTicket.find({ vendorId }).sort({ createdAt: -1 });
  }

  async countTotal() {
    return await SupportTicket.countDocuments();
  }
}

const supportRepository = new SupportRepository();
export default supportRepository;
