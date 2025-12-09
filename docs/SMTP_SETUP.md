# SMTP Configuration for Email (Required for Password Reset)

To enable password reset functionality, add these environment variables to your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_NAME=EcoSphere
FROM_EMAIL=your_email@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Gmail Setup Instructions

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security > 2-Step Verification > App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password
4. Use this app password as `SMTP_PASSWORD`

## Testing Password Reset

1. Ensure your `.env` file has the SMTP variables configured
2. Start the development server: `npm run dev`
3. Navigate to `http://localhost:3000/forgot-password`
4. Enter a valid email address from your database
5. Check your email for the reset link
6. Click the link to reset your password
