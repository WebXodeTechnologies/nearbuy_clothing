import { NextResponse } from "next/server";

class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message || "An unexpected error occurred.";
    this.errors = Array.isArray(errors) ? errors : [];
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Static Factory Helper Methods
  static badRequest(message = "Bad Request", errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized access") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden access") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(500, message);
  }

  /**
   * Centralized App Router Error Formatter
   * Converts any thrown Error instance into a Next.js NextResponse
   */
  static handle(error) {
    // 1. Custom ApiError Instance
    if (error instanceof ApiError) {
      const hasErrors = Array.isArray(error.errors) && error.errors.length > 0;
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          errors: hasErrors ? error.errors : null,
        },
        { status: error.statusCode || 500 },
      );
    }

    // 2. Mongoose Validation Error
    if (error?.name === "ValidationError") {
      const formattedErrors = Object.values(error.errors || {}).map((val) => ({
        field: val.path,
        message: val.message,
      }));
      return NextResponse.json(
        {
          success: false,
          message: "Database validation failed.",
          errors: formattedErrors.length > 0 ? formattedErrors : null,
        },
        { status: 400 },
      );
    }

    // 3. Mongoose Cast Error (Invalid Mongo ObjectId)
    if (error?.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid format for field: ${error.path}`,
          errors: null,
        },
        { status: 400 },
      );
    }

    // 4. MongoDB Duplicate Key Error
    if (error?.code === 11000) {
      const fieldName = error.keyValue
        ? Object.keys(error.keyValue)[0]
        : "field";
      return NextResponse.json(
        {
          success: false,
          message: `A record with this ${fieldName} already exists.`,
          errors: null,
        },
        { status: 400 },
      );
    }

    // 5. Standard JS / Fallback Server Error
    const statusCode = error?.statusCode || error?.status || 500;
    const message = error?.message || "Internal Server Error";
    const formattedErrors = Array.isArray(error?.errors) ? error.errors : null;

    return NextResponse.json(
      {
        success: false,
        message,
        errors: formattedErrors,
      },
      { status: statusCode },
    );
  }
}

export default ApiError;
