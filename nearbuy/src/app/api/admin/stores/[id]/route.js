import { authenticate } from "@/middleware/auth.middleware";
import dbConnect from "@/lib/db";
import Store from "@/models/Store";
import ApiResponse from "@/utils/apiResponse";
import ApiError from "@/utils/apiError";
import { withErrorHandler } from "@/middleware/error.middleware";

// PUT -> Update store details (Status, Featured, etc.)
export const PUT = withErrorHandler(async (req, context) => {
  const user = await authenticate(req);
  const role = (user?.role || "").toUpperCase();

  if (!user || role !== "ADMIN") {
    throw new ApiError(403, "Access denied: Admin privileges required.");
  }

  await dbConnect();
  const resolvedParams = await context?.params;
  const storeId = resolvedParams?.id;

  const body = await req.json();

  const updatedStore = await Store.findByIdAndUpdate(
    storeId,
    { $set: body },
    { new: true, runValidators: true },
  );

  if (!updatedStore) {
    throw new ApiError(404, "Store profile not found.");
  }

  return ApiResponse.success(
    updatedStore,
    "Store updated successfully by admin",
  );
});

// DELETE -> Permanently remove a store
export const DELETE = withErrorHandler(async (req, context) => {
  const user = await authenticate(req);
  const role = (user?.role || "").toUpperCase();

  if (!user || role !== "ADMIN") {
    throw new ApiError(403, "Access denied: Admin privileges required.");
  }

  await dbConnect();
  const resolvedParams = await context?.params;
  const storeId = resolvedParams?.id;

  const deletedStore = await Store.findByIdAndDelete(storeId);

  if (!deletedStore) {
    throw new ApiError(404, "Store profile not found.");
  }

  return ApiResponse.success(null, "Store deleted successfully");
});
