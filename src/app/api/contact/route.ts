import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const db = getFirestore(getAdminApp());
    await db.collection("contact_messages").add({
      name,
      email,
      subject: subject || "general",
      message,
      createdAt: new Date().toISOString(),
      read: false,
    });

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort) || 587,
        secure: Number(smtpPort) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"moltiki Contact" <${smtpUser}>`,
        to: "support@moltiki.com",
        replyTo: email,
        subject: `[moltiki] ${subject || "General Inquiry"} — from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "General"}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family:monospace;max-width:600px">
            <h2 style="color:#a855f7">New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject || "General"}</p>
            <hr style="border-color:#333"/>
            <p style="white-space:pre-wrap">${message}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
