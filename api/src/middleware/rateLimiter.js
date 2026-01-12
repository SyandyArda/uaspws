const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/response');

// Rate limit configurations
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000; // 1 hour
const RATE_LIMIT_FREE_TIER = parseInt(process.env.RATE_LIMIT_FREE_TIER) || 100;
const RATE_LIMIT_BASIC_TIER = parseInt(process.env.RATE_LIMIT_BASIC_TIER) || 1000;
const RATE_LIMIT_PREMIUM_TIER = parseInt(process.env.RATE_LIMIT_PREMIUM_TIER) || 10000;

/**
 * Custom key generator based on API key or IP
 */
const keyGenerator = (req) => {
    return req.headers['x-api-key'] || req.ip;
};

/**
 * Custom handler for rate limit exceeded
 */
const handler = (req, res) => {
    const error = ApiResponse.error(
        'RATE_LIMIT_EXCEEDED',
        'Too many requests. Please try again later.',
        {
            retry_after: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
            limit: req.rateLimit.limit
        },
        429
    );
    return res.status(429).json(error);
};

/**
 * Free tier rate limiter (100 requests/hour)
 */
const freeTierLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_FREE_TIER,
    keyGenerator,
    handler,
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Basic tier rate limiter (1000 requests/hour)
 */
const basicTierLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_BASIC_TIER,
    keyGenerator,
    handler,
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Premium tier rate limiter (10000 requests/hour)
 */
const premiumTierLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_PREMIUM_TIER,
    keyGenerator,
    handler,
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Dynamic rate limiter based on user tier
 */
const dynamicRateLimiter = (req, res, next) => {
    // Default to free tier if no user or tier info
    const userTier = req.user?.tier || 'free';

    switch (userTier) {
        case 'premium':
            return premiumTierLimiter(req, res, next);
        case 'basic':
            return basicTierLimiter(req, res, next);
        default:
            return freeTierLimiter(req, res, next);
    }
};

module.exports = {
    freeTierLimiter,
    basicTierLimiter,
    premiumTierLimiter,
    dynamicRateLimiter
};
