import { NextResponse } from "next/server";

class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message || "An unexpected error occurred.";
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static handle(error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          errors: error.errors.length > 0 ? error.errors : null,
        },
        { status: error.statusCode }
      );
    }

    // Handle standard JS / Mongoose errors
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || "Internal Server Error";

    return NextResponse.json(
      {
        success: false,
        message,
        errors: error.errors || null,
      },
      { status: statusCode }
    );
  }
}

export default ApiError;
