import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000]; // cents

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const { amount } = await req.json();

    const cents = Math.round(Number(amount));
    if (!cents || cents < 100 || cents > 100000) {
      return NextResponse.json(
        { error: "Amount must be between $1 and $1,000" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || "https://moltiki-app.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to moltiki",
              description: "Thank you for supporting the open knowledge protocol!",
            },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/donate?success=true`,
      cancel_url: `${origin}/donate`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Donation failed";
    console.error("Stripe donation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
