import ApiError from "@/utils/apiError";

/**
 * Validates request payload or parameters against a Zod schema
 * @param {ZodSchema} schema - Zod schema object
 * @param {Object} data - Input data to validate
 */
export function validate(schema, data) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const formattedErrors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    throw new ApiError(400, "Invalid request data", formattedErrors);
  }

  return result.data;
}

export default validate;
