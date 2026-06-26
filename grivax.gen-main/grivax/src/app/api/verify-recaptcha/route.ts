import 'dotenv/config'
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { token } = body;

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    // If secret key is not configured, auto-pass verification in development
    if (!secretKey) {
        console.warn("RECAPTCHA_SECRET_KEY is not configured. Auto-passing verification for development.");
        return NextResponse.json({
            success: true,
            score: 0.9,
            message: "reCAPTCHA not configured - development mode"
        });
    }

    try {
        const verificationResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
            method: 'POST',
        });

        const verification = await verificationResponse.json();

        if (verification.success && verification.score > 0.5) {
            return NextResponse.json({
                success: true,
                score: verification.score
            });
        } else {
            return NextResponse.json({
                success: false,
                score: verification.score,
                errorCodes: verification['error-codes']
            });
        }
    } catch (error) {
        console.error("Error verifying reCAPTCHA:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to verify reCAPTCHA"
        }, { status: 500 });
    }
}
