import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/debug/health
 * Diagnostic endpoint — tests that all backend services are reachable.
 * Visit this URL in your browser to see what's working and what's broken.
 */
export async function GET() {
  const results: Record<string, { ok: boolean; detail: string }> = {};

  // 1. Check Firebase Admin SDK
  try {
    const { getAdminApp } = await import("@/lib/firebase-admin");
    getAdminApp();
    results.firebaseAdmin = { ok: true, detail: "Firebase Admin SDK initialized" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    results.firebaseAdmin = { ok: false, detail: msg };
  }

  // 2. Check Firestore connectivity (try to read a non-existent doc)
  try {
    const { getFirestore } = await import("firebase-admin/firestore");
    const { getAdminApp } = await import("@/lib/firebase-admin");
    const db = getFirestore(getAdminApp());
    await db.collection("users").doc("health_check_test").get();
    results.firestore = { ok: true, detail: "Firestore is reachable and responding" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    results.firestore = { ok: false, detail: msg };
  }

  // 3. Check MongoDB (for articles)
  try {
    const { default: dbConnect } = await import("@/lib/mongodb");
    await dbConnect();
    results.mongodb = { ok: true, detail: "MongoDB connected" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    results.mongodb = { ok: false, detail: msg };
  }

  // 4. Check Stripe
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRO_PRICE_ID;

    if (!stripeKey || stripeKey === "sk_test_REPLACE_ME") {
      results.stripe = { ok: false, detail: "STRIPE_SECRET_KEY is missing or still a placeholder" };
    } else if (!priceId || priceId === "price_REPLACE_ME") {
      results.stripe = { ok: false, detail: "STRIPE_PRO_PRICE_ID is missing or still a placeholder" };
    } else {
      // Try to initialize Stripe and verify the price exists
      const { getStripe } = await import("@/lib/stripe");
      const stripe = getStripe();
      const price = await stripe.prices.retrieve(priceId);
      results.stripe = {
        ok: true,
        detail: `Stripe connected. Price: ${price.nickname || priceId} — $${(price.unit_amount || 0) / 100}/${price.recurring?.interval || "?"}`,
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    results.stripe = { ok: false, detail: `Stripe error: ${msg}` };
  }

  // 5. Check env vars presence (not values)
  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_ADMIN_PROJECT_ID: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    MONGODB_URI: !!process.env.MONGODB_URI,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "sk_test_REPLACE_ME",
    STRIPE_PRO_PRICE_ID: !!process.env.STRIPE_PRO_PRICE_ID && process.env.STRIPE_PRO_PRICE_ID !== "price_REPLACE_ME",
  };

  const allOk = Object.values(results).every((r) => r.ok);

  return NextResponse.json({
    status: allOk ? "healthy" : "unhealthy",
    services: results,
    envVars,
    timestamp: new Date().toISOString(),
  }, { status: allOk ? 200 : 503 });
}
