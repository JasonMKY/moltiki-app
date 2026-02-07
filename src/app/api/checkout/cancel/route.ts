import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { verifyIdToken, extractBearerToken } from "@/lib/firebase-admin";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/lib/models/User";

/**
 * POST /api/checkout/cancel
 * Cancel the user's Pro subscription in Stripe and downgrade to free.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify auth
    const token = extractBearerToken(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const decoded = await verifyIdToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid auth token" }, { status: 401 });
    }

    await dbConnect();
    const user = await UserModel.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan !== "pro") {
      return NextResponse.json(
        { error: "You are not on the Pro plan" },
        { status: 400 }
      );
    }

    // Cancel the Stripe subscription
    if (user.stripeSubscriptionId) {
      const stripe = getStripe();
      try {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (stripeErr: unknown) {
        const msg =
          stripeErr instanceof Error ? stripeErr.message : "Stripe cancel failed";
        console.error("Stripe cancel error:", msg);
        // Continue with downgrade even if Stripe cancel fails
        // (subscription may already be canceled)
      }
    }

    // Downgrade user in DB
    user.plan = "free";
    user.stripeSubscriptionId = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Pro subscription canceled. You have been downgraded to the free plan.",
      user: user.toObject(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Cancel failed";
    console.error("Cancel subscription error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
