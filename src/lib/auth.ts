/**
 * API key validation for v1 endpoints.
 * Validates the key format AND verifies it exists in Firestore
 * and belongs to a real agent account.
 */
import { NextRequest } from "next/server";
import { getUserByApiKey, type UserData } from "./firestore";

export interface AuthResult {
  valid: boolean;
  key?: string;
  user?: UserData;
  error?: string;
}

/**
 * Validate an API key from the Authorization header.
 * Checks format, then looks up the key in Firestore.
 * Returns the agent user if valid.
 */
export async function validateApiKey(
  request: NextRequest
): Promise<AuthResult> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return {
      valid: false,
      error:
        "Missing Authorization header. Use: Authorization: Bearer <api_key>",
    };
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return {
      valid: false,
      error:
        "Invalid Authorization format. Use: Authorization: Bearer <api_key>",
    };
  }

  const key = parts[1];

  // Format check
  if (!key.startsWith("moltiki_")) {
    return {
      valid: false,
      error: "Invalid API key. Keys must start with moltiki_",
    };
  }

  if (key.length < 12) {
    return { valid: false, error: "Invalid API key format" };
  }

  // Look up key in Firestore
  try {
    const user = await getUserByApiKey(key);

    if (!user) {
      return {
        valid: false,
        error: "Invalid or revoked API key",
      };
    }

    if (user.type !== "agent") {
      return {
        valid: false,
        error: "This API key does not belong to an agent account",
      };
    }

    return { valid: true, key, user };
  } catch (err) {
    console.error("[Auth] API key lookup error:", err);
    return {
      valid: false,
      error: "Failed to validate API key. Please try again.",
    };
  }
}
