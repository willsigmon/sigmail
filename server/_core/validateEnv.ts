import { ENV } from "./env";

type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical environment variables for production
  if (ENV.isProduction) {
    if (!ENV.databaseUrl) {
      errors.push("DATABASE_URL is required in production");
    }

    if (!ENV.cookieSecret || ENV.cookieSecret.length < 32) {
      errors.push("JWT_SECRET must be set and at least 32 characters in production");
    }

    if (!ENV.appId) {
      errors.push("VITE_APP_ID is required for OAuth in production");
    }

    if (!ENV.oAuthServerUrl) {
      errors.push("OAUTH_SERVER_URL is required for OAuth in production");
    }
  }

  // Warnings for development
  if (!ENV.isProduction) {
    if (!ENV.databaseUrl) {
      warnings.push("DATABASE_URL not set - database features will be disabled");
    }

    if (!ENV.appId) {
      warnings.push("VITE_APP_ID not set - OAuth login will not work");
    }

    if (ENV.cookieSecret === "" || ENV.cookieSecret.length < 32) {
      warnings.push("JWT_SECRET should be at least 32 characters");
    }
  }

  // Optional features warnings
  if (!ENV.forgeApiKey && !ENV.isProduction) {
    warnings.push("BUILT_IN_FORGE_API_KEY not set - AI features will be disabled");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function logEnvironmentValidation(): void {
  const result = validateEnvironment();

  if (result.errors.length > 0) {
    console.error("\n❌ Environment Validation Errors:");
    result.errors.forEach((error) => console.error(`  - ${error}`));
    console.error("");
  }

  if (result.warnings.length > 0) {
    console.warn("\n⚠️  Environment Validation Warnings:");
    result.warnings.forEach((warning) => console.warn(`  - ${warning}`));
    console.warn("");
  }

  if (result.valid && result.warnings.length === 0) {
    console.log("✅ Environment validation passed");
  }

  // In production, fail fast if there are errors
  if (ENV.isProduction && !result.valid) {
    console.error("\n💥 Cannot start server with invalid environment configuration\n");
    process.exit(1);
  }
}

