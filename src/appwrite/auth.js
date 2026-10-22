
import conf from "../conf/conf.js";
import { Client, Account, TablesDB, ID, Functions } from "appwrite";

class AuthService {
  client = new Client();
  account;
  tablesDB;
  functions;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
    this.tablesDB = new TablesDB(this.client);
    this.functions = new Functions(this.client);
  }

  // Send OTP to the phone number
  async sendPhoneOTP(phone, existingUserId = null) {
    const userId = existingUserId || ID.unique();

    return this.account.createPhoneToken({
      userId,
      phone,
    });
  }

  // Verify OTP and create a session
  async verifyPhoneOTP(userId, secret) {
    return this.account.createSession({
      userId,
      secret,
    });
  }

  // Check whether a phone number is already registered
  async checkPhone(phone) {
    const execution = await this.functions.createExecution({
      functionId: "6ad9d6ad00268d2fbc95",
      body: JSON.stringify({ phone }),
      async: false,
      xpath: "/check-phone",
      method: "POST",
    });

    let result = {};

    try {
      result = JSON.parse(execution.responseBody || "{}");
    } catch {
      throw new Error("Invalid response received from registration backend.");
    }

    if (execution.responseStatusCode >= 400) {
      throw new Error(
        result.error || "Unable to check phone number."
      );
    }

    return result;
  }

  // Save registration after phone verification
  async saveRegistration(form) {
    const execution = await this.functions.createExecution({
      functionId: "6ad9d6ad00268d2fbc95",
      body: JSON.stringify(form),
      async: false,
      xpath: "/save-registration",
      method: "POST",
    });

    let result = {};

    try {
      result = JSON.parse(execution.responseBody || "{}");
    } catch {
      throw new Error("Invalid response received from registration backend.");
    }

    if (execution.responseStatusCode >= 400) {
      throw new Error(
        result.error || "Unable to save registration."
      );
    }

    return result;
  }
}

const authService = new AuthService();

export default authService;
