"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/frontend/redux/store";
import { updateProfile } from "@/frontend/redux/Slice/UserSlice";
import ImageUpload from "@/components/layout/common/ImageUpload";
import { Edit, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { ChangePasswordSchema } from "@/frontend/schema/profile.schema";
import { getUserData } from "@/frontend/api/Users";
import { Shop } from "@/types/UserTypes";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function RestaurantProfile({
  id,
  role,
}: {
  id: string;
  role: string;
}) {
  const t = useTranslations("Profile");
  const [user, setUser] = useState<Shop>();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Shop>>({});
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

  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserData<Shop>(id, role);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, role]);

  if (loading)
    return <div className="p-6 text-center">{t("states.loading")}</div>;
  if (!user)
    return <div className="p-6 text-center">{t("states.notFound")}</div>;

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
    toast.success(t("toasts.passwordChanged"));
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
      name: user.name,
      phoneNumber: user.phoneNumber,
      location: user.location,
      workingHours: user.workingHours,
      description: user.description,
    });
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      try {
        const response = await fetch(`/api/restaurants/${user._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          // Refresh local state with updated data
          setUser((prev) => (prev ? { ...prev, ...formData } : prev));
          toast.success(t("toasts.profileUpdated"));
        } else {
          toast.error(result.message || t("toasts.profileUpdateFailed"));
        }
      } catch (error) {
        console.error("Failed to update profile", error);
        toast.error(t("toasts.profileUpdateFailed"));
      }
      setIsEditing(false);
    }
  };

  const handleImageUpdate = (newUrl: string) => {
    dispatch(updateProfile({ avatar: newUrl }));
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Section */}
      <div className="bg-card shadow rounded-lg p-4 sm:p-6 border border-border relative">
        {/* Edit Button - Top Right (Desktop) */}
        <button
          onClick={handleEditClick}
          className="hidden lg:block absolute top-6 right-6 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
          title={t("common.editProfile")}
        >
          <Edit className="w-5 h-5" />
        </button>

        <div className="flex flex-col xl:flex-row items-start gap-8">
          {/* Left Side: Identity */}
          <div className="flex flex-col gap-6 w-full xl:w-auto xl:min-w-87.5">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <ImageUpload
                currentImageUrl={user.avatar?.url}
                onImageUpdate={handleImageUpdate}
              />
              <div className="flex flex-col gap-3 text-center sm:text-left">
                <div>
                  <h1 className="text-2xl font-bold text-card-foreground">
                    {user.name || t("restaurant.shopName")}
                  </h1>
                  <p className="text-muted-foreground">
                    {t("restaurant.role")}
                  </p>
                </div>
                <div className="lg:hidden mt-2 w-fit mx-auto sm:mx-0">
                  <button
                    onClick={handleEditClick}
                    className="myBtnPrimary flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{t("common.editProfile")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider (Visible on XL screens) */}
          <div className="hidden xl:block w-px bg-border self-stretch"></div>

          {/* Right Side: Restaurant Information */}
          <div className="flex-1 w-full">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              {t("restaurant.restaurantInformation")}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("restaurant.location")}
                </p>
                <p className="font-medium text-card-foreground">
                  {user.location || t("common.na")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("common.phoneNumber")}
                </p>
                <p className="font-medium text-card-foreground">
                  {user.phoneNumber || t("common.na")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("restaurant.workingHours")}
                </p>
                <p className="font-medium text-card-foreground">
                  {user.workingHours || t("common.na")}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">
                  {t("restaurant.description")}
                </p>
                <p className="font-medium text-card-foreground">
                  {user.description || t("restaurant.noDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-card shadow rounded-lg px-6 border border-border">
        <button
          onClick={() => setIsSecurityOpen(!isSecurityOpen)}
          className="w-full py-6 flex items-center justify-between group"
        >
          <h2 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {t("security.title")}
          </h2>
          {isSecurityOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </button>
        {isSecurityOpen && (
          <div className="max-w-md space-y-4 pb-6 animate-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                {t("security.currentPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="myInput pr-12"
                  placeholder={t("security.currentPasswordPlaceholder")}
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
                {t("security.newPassword")}
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
                  placeholder={t("security.newPasswordPlaceholder")}
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
                {t("security.confirmPassword")}
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
                  placeholder={t("security.confirmPasswordPlaceholder")}
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
              {t("security.changePassword")}
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-card-foreground">
              {t("restaurant.editModalTitle")}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  {t("restaurant.shopName")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || user.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  {t("common.phoneNumber")}
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || user.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  {t("restaurant.location")}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location || user.location}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  {t("restaurant.workingHours")}
                </label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours || user.workingHours}
                  onChange={handleInputChange}
                  placeholder="e.g., 9 AM - 10 PM"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  {t("restaurant.description")}
                </label>
                <textarea
                  name="description"
                  value={formData.description || user.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-input rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
              >
                {t("common.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
