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

    // Mongoose Validation Error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors || {}).map((val) => ({
        field: val.path,
        message: val.message,
      }));
      return NextResponse.json(
        {
          success: false,
          message: "Database validation failed.",
          errors,
        },
        { status: 400 }
      );
    }

    // Mongoose Cast Error (Invalid ID)
    if (error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid format for field: ${error.path}`,
          errors: null,
        },
        { status: 400 }
      );
    }

    // MongoDB Duplicate Key Error
    if (error.code === 11000) {
      const fieldName = error.keyValue ? Object.keys(error.keyValue)[0] : "field";
      return NextResponse.json(
        {
          success: false,
          message: `A record with this ${fieldName} already exists.`,
          errors: null,
        },
        { status: 400 }
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
