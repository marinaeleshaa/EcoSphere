"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/frontend/redux/store";
import {
  updateUserProfile,
  updateProfile,
} from "@/frontend/redux/Slice/UserSlice";
import ImageUpload from "@/components/layout/common/ImageUpload";
import OrderHistoryEmptyState from "./OrderHistoryEmptyState";
import { Edit, Eye, EyeOff } from "lucide-react";
import { ChangePasswordSchema } from "@/frontend/schema/profile.schema";
import { getUserData } from "@/frontend/api/Users";
import { User } from "@/types/UserTypes";

export default function CustomerProfile({ id, role }: { id: string; role: string }) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData<User>(id, role);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading profile...</div>;
  if (!user) return <div className="p-6 text-center">User not found.</div>;

  const validatePassword = (data: typeof passwordData) => {
    const result = ChangePasswordSchema.safeParse(data);
    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        currentPassword: formatted.currentPassword?._errors[0] || "",
        newPassword: formatted.newPassword?._errors[0] || "",
        confirmPassword: formatted.confirmPassword?._errors[0] || "",
      });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChangePassword = () => {
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (!validatePassword(passwordData)) {
      return;
    }

    // Dispatch password change logic here
    // For now, we'll just simulate success or dispatch if needed
    // Note: The actual API call needs to be implemented in the slice/thunk
    alert("Password change validation passed! (API integration pending)");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setTouched({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
    });
  };

  const handleEditClick = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      birthDate: user.birthDate,
      gender: user.gender,
    });
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newData = { ...passwordData, [name]: value };
    setPasswordData(newData);
    setTouched((prev) => ({ ...prev, [name]: true }));
    validatePassword(newData);
  };

  const handleSave = async () => {
    if (user._id) {
      await dispatch(
        updateUserProfile({ id: user._id, data: formData as any })
      );
      setIsEditing(false);
    }

    const handleImageUpdate = (newUrl: string) => {
      dispatch(updateProfile({ avatar: newUrl }));
    };

    return (
      <div className="space-y-6">
        {/* Main Profile Section */}
        <div className="bg-card shadow rounded-lg p-6 border border-border relative">
          {/* Edit Button - Top Right */}
          <button
            onClick={handleEditClick}
            className="absolute top-6 right-6 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
            title="Edit Profile"
          >
            <Edit className="w-5 h-5" />
          </button>

          <div className="flex flex-col xl:flex-row items-start gap-8">
            {/* Left Side: Identity */}
            <div className="flex flex-col gap-6 w-full xl:w-auto xl:min-w-[350px]">
              <div className="flex items-center gap-6">
                <ImageUpload
                  currentImageUrl={user.avatar?.url}
                  onImageUpdate={handleImageUpdate}
                />
                <div className="flex flex-col gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-card-foreground">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-muted-foreground">Customer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider (Visible on XL screens) */}
            <div className="hidden xl:block w-px bg-border self-stretch"></div>

            {/* Right Side: Personal Information */}
            <div className="flex-1 w-full">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-card-foreground">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium text-card-foreground">
                    {user.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-card-foreground">
                    {user.address || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Birth Date</p>
                  <p className="font-medium text-card-foreground">
                    {user.birthDate || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize text-card-foreground">
                    {user.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">EcoPoints</p>
                  <p className="font-medium text-card-foreground">
                    {user.points || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-card shadow rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">
            Security
          </h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="myInput pr-12"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {touched.currentPassword && errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className={`myInput pr-12 ${
                    !passwordData.currentPassword
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder="Enter new password"
                  disabled={!passwordData.currentPassword}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {touched.newPassword && errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className={`myInput pr-12 ${
                    !passwordData.newPassword
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  placeholder="Confirm new password"
                  disabled={!passwordData.newPassword}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              onClick={handleChangePassword}
              className={`mt-8 myBtnPrimary w-full ${
                !passwordData.confirmPassword ||
                passwordData.newPassword !== passwordData.confirmPassword
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                !passwordData.confirmPassword ||
                passwordData.newPassword !== passwordData.confirmPassword
              }
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Order History */}
        {user.paymentHistory && user.paymentHistory.length > 0 ? (
          <div className="bg-card shadow rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              Order History
            </h2>
            <p className="text-muted-foreground">
              You have {user.paymentHistory.length} past order(s).
            </p>
          </div>
        ) : (
          <OrderHistoryEmptyState />
        )}

        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-card-foreground">
                Edit Profile
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-input rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
}
