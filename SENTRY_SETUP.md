# Sentry Setup Guide

This project uses [@sentry/nextjs](https://docs.sentry.io/platforms/javascript/guides/nextjs/) for error monitoring, tracing, and session replay.

## ✅ What's Configured

- **Error Monitoring** - Captures errors from all runtimes (browser, Node.js, Edge)
- **Tracing** - Server-side request tracing + client-side navigation spans
- **Session Replay** - Records user sessions around errors (10% sample rate)
- **Logging** - Sentry Logs integration enabled

## 📁 Files Created

```
instrumentation.ts              # Server registration hook
instrumentation-client.ts       # Browser/client runtime config
sentry.server.config.ts         # Node.js server config
sentry.edge.config.ts           # Edge runtime config
app/global-error.tsx            # App Router error boundary
app/sentry-example/page.tsx     # Test page (can be deleted)
```

## 🔑 Configuration

### Environment Variables

Create `.env.local` with your Sentry credentials:

```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=sntrys_eyJ...
```

### Getting Your DSN

1. Go to [sentry.io](https://sentry.io)
2. Navigate to: Settings → Projects → {your-project} → Keys
3. Copy the DSN

### Creating Auth Token

1. Go to [sentry.io/settings/auth-tokens/](https://sentry.io/settings/auth-tokens/)
2. Create token with scopes: `project:releases`, `org:read`
3. Copy the token to `.env.local`

## 🧪 Testing

Visit `/sentry-example` to test error reporting:

```bash
npm run dev
# Open http://localhost:3000/sentry-example
```

Click "Trigger Test Error" to send a test error to Sentry.

## 📊 What's Monitored

### Client-Side (Browser)
- ✅ React component errors
- ✅ Unhandled promise rejections
- ✅ Navigation errors (App Router)
- ✅ User interactions (Session Replay)

### Server-Side (Node.js)
- ✅ API route errors
- ✅ Server component errors
- ✅ Server action errors
- ✅ Unhandled exceptions

### Edge Runtime
- ✅ Middleware errors
- ✅ Edge API route errors
- ✅ Edge function errors

## 🔒 Security Notes

- ✅ `.env.local` is in `.gitignore`
- ✅ `.env.sentry-build-plugin` is in `.gitignore`
- ✅ Auth token only used during build
- ✅ DSN is public (by design)

## 📈 Sample Rates

| Feature | Development | Production |
|---------|-------------|------------|
| Errors | 100% | 100% |
| Traces | 100% | 10% |
| Session Replay (all) | 10% | 10% |
| Session Replay (errors) | 100% | 100% |

## 🔗 Useful Links

- [Sentry Dashboard](https://sentry.io/)
- [Next.js SDK Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Session Replay Docs](https://docs.sentry.io/platforms/javascript/session-replay/)
