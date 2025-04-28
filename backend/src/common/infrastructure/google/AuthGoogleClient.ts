/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import { GoogleAuth } from 'google-auth-library';

export class AuthGoogleClient {
  private static instance: AuthGoogleClient;
  private client: GoogleAuth;

  private constructor() {
    const client = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      //keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    this.client = client;
  }

  public static async getInstance() {
    if (!AuthGoogleClient.instance) {
      AuthGoogleClient.instance = new AuthGoogleClient();
    }
    return this.instance.client.getClient();
  }

  public static async convertFhirToJson(resource: any): Promise<any> {
    const resp: any = resource.data;
    const json = await resp.text();
    return JSON.parse(json);
  }
}
