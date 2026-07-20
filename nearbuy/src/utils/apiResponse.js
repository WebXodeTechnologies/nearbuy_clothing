import { NextResponse } from "next/server";

class ApiResponse {
  static success(data = null, message = "Success", statusCode = 200) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: statusCode }
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
      { status: statusCode }
    );
  }
}

export default ApiResponse;
