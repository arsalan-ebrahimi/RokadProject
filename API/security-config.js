// Default Security Configuration for vanta-api
export const securityConfig = {
  allowedOperators: [
    "eq",
    "ne",
    "gt",
    "gte",
    "lt",
    "lte",
    "in",
    "nin",
    "exists",
    "size",
  ],
  forbiddenFields: [
    "password",
    "token",
    "tokens",
    "code",
    "otp",
    "passwordResetToken",
    "__v",
  ],
  accessLevels: {
    guest: { maxLimit: 50, allowedPopulate: ["*"] },
    user: { maxLimit: 100, allowedPopulate: ["*"] },
    admin: { maxLimit: 1000, allowedPopulate: ["*"] },
    superAdmin: { maxLimit: 1000, allowedPopulate: ["*"] },
  },
  // Aggregation safeguards
  maxPipelineStages: 20,
};
