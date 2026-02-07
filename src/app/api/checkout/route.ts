import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { verifyIdToken, extractBearerToken } from "@/lib/firebase-admin";
import dbConnect from "@/lib/mongodb";
import UserModel from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured" },
        { status: 500 }
      );
    }

    // Verify Firebase auth
    const token = extractBearerToken(req.headers.get("authorization"));
    if (!token) {
      return NextResponse.json(
        { error: "Please log in to upgrade to Pro" },
        { status: 401 }
      );
    }

    const decoded = await verifyIdToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid auth token. Please log in again." },
        { status: 401 }
      );
    }

    // Get or create Stripe customer for this user
    await dbConnect();
    const user = await UserModel.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === "pro") {
      return NextResponse.json(
        { error: "You are already on the Pro plan" },
        { status: 400 }
      );
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { firebaseUid: decoded.uid, username: user.username },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        firebaseUid: decoded.uid,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
