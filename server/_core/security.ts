import type { Express, Request, Response, NextFunction } from "express";
import { ENV } from "./env";

/**
 * Security middleware to add security headers
 */
export function addSecurityHeaders(app: Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        // Prevent clickjacking
        res.setHeader("X-Frame-Options", "DENY");

        // Prevent MIME type sniffing
        res.setHeader("X-Content-Type-Options", "nosniff");

        // Enable XSS protection
        res.setHeader("X-XSS-Protection", "1; mode=block");

        // Referrer policy
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        // Content Security Policy (basic - adjust for your needs)
        if (ENV.isProduction) {
            res.setHeader(
                "Content-Security-Policy",
                "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://oauth.manus.im https://forge.manus.im;"
            );
        }

        // Permissions Policy (previously Feature-Policy)
        res.setHeader(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), interest-cohort=()"
        );

        next();
    });
}

/**
 * CORS middleware for production
 */
export function configureCORS(app: Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
        const origin = req.headers.origin;

        // In production, be more strict about origins
        if (ENV.isProduction) {
            // Allow your production domain and Vercel preview URLs
            const allowedOrigins = [
                process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
                // Add your production domain here when you have one
                // "https://yourdomain.com"
            ].filter(Boolean);

            if (origin && allowedOrigins.some(allowed => origin.includes(allowed))) {
                res.setHeader("Access-Control-Allow-Origin", origin);
            }
        } else {
            // In development, allow localhost
            if (origin && (origin.includes("localhost") || origin.includes("127.0.0.1"))) {
                res.setHeader("Access-Control-Allow-Origin", origin);
            }
        }

        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie"
        );

        // Handle preflight requests
        if (req.method === "OPTIONS") {
            res.status(200).end();
            return;
        }

        next();
    });
}

/**
 * Rate limiting helper (basic implementation)
 * For production, consider using a package like express-rate-limit
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function simpleRateLimit(maxRequests: number = 100, windowMs: number = 60000) {
    return (req: Request, res: Response, next: NextFunction) => {
        const ip = req.ip || req.socket.remoteAddress || "unknown";
        const now = Date.now();

        const record = requestCounts.get(ip);

        if (!record || now > record.resetTime) {
            requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
            next();
            return;
        }

        if (record.count >= maxRequests) {
            res.status(429).json({
                error: "Too many requests",
                retryAfter: Math.ceil((record.resetTime - now) / 1000),
            });
            return;
        }

        record.count++;
        next();
    };
}

/**
 * Clean up old rate limit records periodically
 */
setInterval(() => {
    const now = Date.now();
    const entries = Array.from(requestCounts.entries());
    for (const [ip, record] of entries) {
        if (now > record.resetTime) {
            requestCounts.delete(ip);
        }
    }
}, 300000); // Clean up every 5 minutes
