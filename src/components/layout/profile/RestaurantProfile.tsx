"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/frontend/redux/store";
import {
	updateUserProfile,
	updateProfile,
} from "@/frontend/redux/Slice/UserSlice";
import ImageUpload from "@/components/layout/common/ImageUpload";
import { useTranslations } from "next-intl";

export default function RestaurantProfile() {
	const t = useTranslations("Profile.restaurant");
	const tCommon = useTranslations("Profile.common");
	const user = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch<AppDispatch>();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name || "",
		phoneNumber: user.phoneNumber || "",
		location: user.location || "",
		workingHours: user.workingHours || "",
		description: user.description || "",
	});

	const handleChangePassword = () => {
		alert("Change Password feature coming soon!");
	};

	const handleEditClick = () => {
		setFormData({
			name: user.name || "",
			phoneNumber: user.phoneNumber || "",
			location: user.location || "",
			workingHours: user.workingHours || "",
			description: user.description || "",
		});
		setIsEditing(true);
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		if (user.id) {
			await dispatch(updateUserProfile({ id: user.id, data: formData }));
			setIsEditing(false);
		}
	};

	const handleImageUpdate = (newUrl: string) => {
		dispatch(updateProfile({ avatar: newUrl }));
	};

	return (
		<div className="space-y-6">
			{/* Main Profile Section */}
			<div className="bg-card shadow rounded-lg p-6 border border-border">
				<div className="flex flex-col xl:flex-row items-start gap-8">
					{/* Left Side: Identity & Actions */}
					<div className="flex flex-col gap-6 w-full xl:w-auto xl:min-w-[350px]">
						<div className="flex items-center gap-6">
							<ImageUpload
								currentImageUrl={user.avatar}
								onImageUpdate={handleImageUpdate}
							/>
							<div className="flex flex-col gap-3">
								<div>
									<h1 className="text-2xl font-bold text-card-foreground">
										{user.name || "Restaurant Name"}
									</h1>
									<p className="text-muted-foreground">{t("role")}</p>
								</div>
								<div className="flex flex-wrap gap-2">
									<button
										onClick={handleEditClick}
										className="bg-primary text-primary-foreground px-3 py-1.5 text-sm rounded-lg hover:bg-primary/90 transition whitespace-nowrap"
									>
										{tCommon("editProfile")}
									</button>
									<button
										onClick={handleChangePassword}
										className="bg-destructive text-destructive-foreground px-3 py-1.5 text-sm rounded-lg hover:bg-destructive/90 transition whitespace-nowrap"
									>
										{tCommon("changePassword")}
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
							{t("shopName")} Information
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">{t("location")}</p>
								<p className="font-medium text-card-foreground">
									{user.location || tCommon("na")}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									{tCommon("phoneNumber")}
								</p>
								<p className="font-medium text-card-foreground">
									{user.phoneNumber || tCommon("na")}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									{t("workingHours")}
								</p>
								<p className="font-medium text-card-foreground">
									{user.workingHours || tCommon("na")}
								</p>
							</div>
							<div className="col-span-2">
								<p className="text-sm text-muted-foreground">
									{t("description")}
								</p>
								<p className="font-medium text-card-foreground">
									{user.description || "No description available."}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			{isEditing && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-card rounded-lg p-6 w-full max-w-md border border-border shadow-lg">
						<h2 className="text-xl font-bold mb-4 text-card-foreground">
							{t("editModalTitle")}
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-card-foreground mb-1">
									{t("shopName")}
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-card-foreground mb-1">
									{tCommon("phoneNumber")}
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
									{t("location")}
								</label>
								<input
									type="text"
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-card-foreground mb-1">
									{t("workingHours")}
								</label>
								<input
									type="text"
									name="workingHours"
									value={formData.workingHours}
									onChange={handleInputChange}
									placeholder="e.g., 9 AM - 10 PM"
									className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-card-foreground mb-1">
									{t("description")}
								</label>
								<textarea
									name="description"
									value={formData.description}
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
								{tCommon("cancel")}
							</button>
							<button
								onClick={handleSave}
								className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
							>
								{tCommon("saveChanges")}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
