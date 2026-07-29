import { NextResponse } from "next/server";

class ApiResponse {
  static success(data = null, message = "Success", statusCode = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: statusCode },
    );
  }

  static created(data = null, message = "Resource created successfully") {
    return this.success(data, message, 201);
  }

  static error(message = "An error occurred", statusCode = 500, errors = null) {
    return NextResponse.json(
      {
        success: false,
        message,
        errors,
      },
      { status: statusCode },
    );
  }

  static badRequest(message = "Bad request", errors = null) {
    return this.error(message, 400, errors);
  }

  static notFound(message = "Resource not found") {
    return this.error(message, 404);
  }
}

export default ApiResponse;
