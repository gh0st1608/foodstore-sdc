/* eslint-disable @typescript-eslint/no-explicit-any */
export class SuccessFormatResponse {
  public static transform(input: any,  message: string) {
    const response: any = {
      status: 200,
      message
    };

    if (input !== null && input !== undefined) {
      response.payload = input;
    }

    return response;
  }
}
