import * as Z from "zod";

export const Step2UserSchema = Z.object({
  firstName: Z.string()
    .min(3)
    .max(30)
    .nonempty({ message: "First name is required" }),
  lastName: Z.string()
    .min(3)
    .max(30)
    .nonempty({ message: "Last name is required" }),
  birthDate: Z.string().nonempty({ message: "Birth date is required" }), // remove min/max for date
  phoneNumber: Z.string()
    .nonempty({ message: "Phone number is required" })
    .regex(/^\d{11}$/, { message: "Phone number must be 11 digits" }),
  gender: Z.enum(["male", "female"]),
  address: Z.string().min(5).nonempty({ message: "Address is required" }),
});

export const LastStepSchema = Z.object({
  email: Z.string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address"),

  password: Z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
      {
        message:
          "Password must contain uppercase, lowercase, number, and special character",
      }
    ),

  confirmPassword: Z.string().min(8, {
    message: "Confirm password is required",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const Step2ShopSchema = Z.object({
  name: Z.string().min(3).max(30).nonempty({ message: "Name is required" }),
  description: Z.string().nonempty({ message: "Description is required" }),
  phoneNumber: Z.string()
    .nonempty({ message: "Phone number is required" })
    .regex(/^\d{11}$/, { message: "Phone number must be 11 digits" }),
  hotline: Z.string().nonempty({ message: "Hotline is required" }),
});

// export const Step3ShopSchema = Z.object({
//   avatar: Z.string().nonempty({ message: "Avatar is required" }),
//   location: Z.string().nonempty({ message: "Location is required" }),
//   workingHours: Z.string().nonempty({ message: "Working hours is required" }),
// });

export const Step3ShopSchema = Z.object({
  avatar: Z.string().nonempty({ message: "Avatar is required" }),
  category: Z.enum(
    ["supermarket", "hypermarket", "grocery", "bakery", "cafe", "other"],
    { message: "Please select a category" }
  ),

  location: Z.string().nonempty({ message: "Location is required" }),
  workingHours: Z.string().nonempty({ message: "Working hours is required" }),
});
