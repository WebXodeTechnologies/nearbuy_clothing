import ApiError from "@/utils/apiError";

/**
 * Validates request payload or parameters against a Zod schema
 * @param {import("zod").ZodSchema} schema - Zod schema object
 * @param {Object} data - Input data to validate
 */
export function validate(schema, data = {}) {
  // Ensure data is at least an object if null/undefined is passed
  const inputData = data === null || data === undefined ? {} : data;

  const result = schema.safeParse(inputData);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));

    // Construct a helpful primary error message for client toast popups
    const firstErrorMessage =
      formattedErrors.length > 0
        ? `${formattedErrors[0].field}: ${formattedErrors[0].message}`
        : "Invalid request data";

    throw new ApiError(400, firstErrorMessage, formattedErrors);
  }

  return result.data;
}

export default validate;
