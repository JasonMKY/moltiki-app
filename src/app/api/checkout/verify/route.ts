import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { updateUser } from "@/lib/firestore";

export const dynamic = "force-dynamic";

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
        // Update user plan in Firestore
        await updateUser(firebaseUid, {
          plan: "pro",
          stripeCustomerId:
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.toString(),
          stripeSubscriptionId:
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.toString(),
        });
      }

      return NextResponse.json({
        paid: true,
        customer_email: session.customer_details?.email || null,
        subscription_id: session.subscription,
      });
    }

    return NextResponse.json({ paid: false });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Verification failed";
    console.error("Stripe verify error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
