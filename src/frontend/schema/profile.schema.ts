import * as Z from "zod";

export const ChangePasswordSchema = Z.object({
  currentPassword: Z.string().min(1, { message: "Current password is required" }),
  newPassword: Z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
      {
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      }
    ),
  confirmPassword: Z.string().min(1, { message: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
