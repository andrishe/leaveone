# Security Guidelines

## 🔐 Environment Variables

⚠️ **CRITICAL**: The `.env` file contains sensitive credentials and should **NEVER** be committed to version control.

### Initial Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Generate a new `BETTER_AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```

3. Update `.env` with your actual credentials:
   - Database URL from Neon dashboard
   - API keys for Resend, Stripe, etc.

### Rotating Secrets

If credentials have been compromised:

1. **Database Password**:
   - Go to Neon dashboard
   - Reset database password
   - Update `DATABASE_URL` in `.env`
   - Restart application

2. **BETTER_AUTH_SECRET**:
   ```bash
   # Generate new secret
   openssl rand -base64 32

   # Update .env with new value
   # All users will be logged out
   ```

3. **API Keys** (Resend, Stripe, etc.):
   - Regenerate in respective dashboards
   - Update `.env`
   - Restart application

### Production Deployment

Use environment variables in your hosting platform (Vercel, etc.):

- **Vercel**: Dashboard → Settings → Environment Variables
- **Never** commit production secrets to Git
- Use different secrets for production vs staging

## 🛡️ Security Best Practices

### Authentication
- Passwords hashed with Argon2
- Sessions expire after 7 days
- HTTPS required in production

### Authorization
- Role-based access control (Employee, Manager, Admin)
- Company-level data isolation
- Managers can only approve their team's requests

### Input Validation
- All API inputs validated with Zod
- SQL injection prevented by Prisma ORM
- XSS protection via React's default escaping

### Rate Limiting
- API endpoints protected against abuse
- Configurable limits per role

## 📋 Security Checklist for Production

- [ ] All secrets rotated from development
- [ ] `.env` not committed to Git
- [ ] HTTPS enabled (`BETTER_AUTH_URL` uses `https://`)
- [ ] Database has strong password
- [ ] Stripe webhook secret configured
- [ ] Error messages don't leak sensitive info
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Dependencies updated regularly
- [ ] Audit logs enabled
- [ ] Backup strategy in place

## 🚨 Incident Response

If you suspect a security breach:

1. **Immediately** rotate all secrets
2. Review audit logs for suspicious activity
3. Check database for unauthorized access
4. Notify affected users if data was compromised
5. Document incident and remediation steps

## 📧 Security Contact

Report security vulnerabilities to: security@leaveone.com
