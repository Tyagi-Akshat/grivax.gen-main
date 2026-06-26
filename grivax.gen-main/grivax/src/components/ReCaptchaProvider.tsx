"use client";

import 'dotenv/config'
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";

interface ReCaptchaProviderProps {
    children: React.ReactNode;
}

const ReCaptchaProvider: React.FC<ReCaptchaProviderProps> = ({ children }) => {
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    if (!recaptchaKey) {
        console.warn(
            "ReCAPTCHA Site Key is not configured. " +
            "Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your .env.local file. " +
            "Get your keys from: https://www.google.com/recaptcha/admin"
        );
        // Render children without ReCaptcha provider
        return <>{children}</>;
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaKey}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
};

export default ReCaptchaProvider;
