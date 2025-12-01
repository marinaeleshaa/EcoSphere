# Profile Page Feature Plan

This document outlines the profile page features for the three main entities: **End User (Customer)**, **Organizer**, and **Restaurant**, based on the specific requirements.

**Common Features:**
*   **Avatar Upload**: Upload to AWS S3, save URL to database.
*   **Change Password**: Verify `Current Password` -> Hash & Save `New Password`.

---

## 1. End User (Customer) Profile
**Source Model:** `User` (role: `customer`)

### A. Basic Information
*   **Avatar**: Display user avatar.
*   **Name**: `firstName` + `lastName`.
*   **EcoPoints**: Display `points` balance.

### B. Personal Settings
*   **Contact Info**: `email` (Read-only), `phoneNumber`, `address`.
*   **Demographics**: `birthDate`, `gender`.
*   **Security**: Change Password.

### C. Activity Dashboard
*   **My Favorites**: Grid of restaurants from `favoritesIds`.
*   **My Cart**: View items in `cart`.
*   **Order History**: List `paymentHistory`.

---

## 2. Organizer Profile
**Source Model:** `User` (role: `organizer`)

### A. Basic Information
*   **Avatar**: Display user avatar.
*   **Name**: `firstName` + `lastName`.

### B. Subscription Management
*   **Expiry Date**: Display `subscriptionPeriod`.
*   **Action**: Button/Link to **Renew Subscription**.

### C. Personal Settings
*   **Contact Info**: `email`, `phoneNumber`, `address`.
*   **Demographics**: `birthDate`, `gender`.
*   **Security**: Change Password.

---

## 3. Restaurant Profile
**Source Model:** `Restaurant`

### A. Restaurant Identity
*   **Avatar**: Display restaurant logo/image.
*   **Name**: `name`.
*   **Info**: `location`, `workingHours`, `phoneNumber`, `description`.

### B. Security
*   **Security**: Change Password.
