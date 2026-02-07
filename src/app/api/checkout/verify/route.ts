import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/lib/models/User";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Extract the Firebase UID from session metadata
      const firebaseUid = session.metadata?.firebaseUid;

      if (firebaseUid) {
        // Update user plan in MongoDB
        await dbConnect();
        await UserModel.findOneAndUpdate(
          { firebaseUid },
          {
            plan: "pro",
            stripeCustomerId:
              typeof session.customer === "string"
                ? session.customer
                : session.customer?.toString(),
          }
        );
      }

      return NextResponse.json({
        paid: true,
        customer_email: session.customer_details?.email || null,
        subscription_id: session.subscription,
      });
    }

    return NextResponse.json({ paid: false });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification failed";
    console.error("Stripe verify error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
