# Password Reset Implementation Plan

This document outlines the implementation of the "Forgot Password" and "Reset Password" functionality using email verification (Nodemailer).

## Overview
The flow allows users (Customers, Organizers, Restaurants) to reset their password if they forget it.
1.  User requests a password reset via email.
2.  System generates a unique token and sends a link to the user's email.
3.  User clicks the link, validating the token.
4.  User sets a new password.

## 1. Backend Implementation

### A. Database Schema Updates
We need to store the reset token and its expiration time.
*   **Models**: `User` and `Restaurant`
*   **New Fields**:
    *   `resetPasswordToken`: String (hashed)
    *   `resetPasswordExpire`: Date

### B. API Endpoints
*   `POST /api/auth/forgot-password`
    *   Input: `email`
    *   Logic:
        1.  Find user by email.
        2.  Generate a random reset token (e.g., using `crypto`).
        3.  Hash the token and save it to `resetPasswordToken`.
        4.  Set `resetPasswordExpire` (e.g., 10 minutes from now).
        5.  Send email with the reset URL: `https://[domain]/reset-password/[token]`.
*   `PUT /api/auth/reset-password/[token]`
    *   Input: `password`, `confirmPassword`
    *   Logic:
        1.  Hash the token from the URL.
        2.  Find user with matching `resetPasswordToken` and valid `resetPasswordExpire`.
        3.  If valid, hash the new password and update the user document.
        4.  Clear the reset token and expiry fields.

### C. Email Service (Nodemailer)
*   Create a utility `sendEmail.ts`.
*   Configure SMTP transport (e.g., Gmail, SendGrid, Mailtrap).
*   Template: Simple HTML email with the reset link.

## 2. Frontend Implementation

### A. Forgot Password Page
*   **Route**: `/forgot-password`
*   **Form**: Input for `email`.
*   **Action**: Calls `POST /api/auth/forgot-password`.
*   **Feedback**: "If an account exists, an email has been sent."

### B. Reset Password Page
*   **Route**: `/reset-password/[token]`
*   **Form**: Inputs for `New Password` and `Confirm Password`.
*   **Action**: Calls `PUT /api/auth/reset-password/[token]`.
*   **Feedback**: "Password reset successful. You can now login."

## 3. Security Considerations
*   **Token Hashing**: Store only the hash of the token in the DB, not the raw token.
*   **Expiration**: Tokens must have a short lifespan (e.g., 10-15 mins).
*   **Rate Limiting**: Prevent spamming the forgot password endpoint.
