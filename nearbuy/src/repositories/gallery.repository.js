import Gallery from "@/models/Gallery";
import "@/models/Vendor";

class GalleryRepository {
  async create(data) {
    return await Gallery.create(data);
  }

  async findByVendorId(vendorId) {
    return await Gallery.find({ vendorId }).sort({ createdAt: -1 }).lean();
  }

  async findById(id) {
    return await Gallery.findById(id).lean();
  }

  async delete(id) {
    return await Gallery.findByIdAndDelete(id);
  }
}

const galleryRepository = new GalleryRepository();
export default galleryRepository;
