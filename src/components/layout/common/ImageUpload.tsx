"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
    currentImageUrl?: string;
    onImageUpdate: (newUrl: string) => void;
    endpoint?: string;
    className?: string;
}

export default function ImageUpload({
    currentImageUrl,
    onImageUpdate,
    endpoint = "/api/upload/avatar",
    className = "",
}: Readonly<ImageUploadProps>) {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        // Validate file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        // Create preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Upload
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in to upload an image");
            setIsUploading(false);
            return;
        }

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Upload failed");
            }

            toast.success("Image uploaded successfully");
            onImageUpdate(data.data.avatar.url);
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
            // Revert preview on failure
            setPreviewUrl(currentImageUrl || null);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete your profile picture?")) return;

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in to delete an image");
            return;
        }

        setIsUploading(true);
        try {
            const res = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Delete failed");
            }

            toast.success("Image deleted successfully");
            setPreviewUrl(null);
            onImageUpdate(""); // Clear image in parent
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(error.message || "Failed to delete image");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={`relative group w-48 h-48 shrink-0 ${className}`}>
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-background shadow-xl relative bg-muted">
                {previewUrl ? (
                    <Image
                        src={previewUrl}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                        <Camera size={32} />
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                        disabled={isUploading}
                    >
                        <Camera size={20} />
                    </button>
                    {previewUrl && (
                        <button
                            onClick={handleDelete}
                            className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white transition-colors"
                            disabled={isUploading}
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                {/* Loading State */}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
            />
        </div>
    );
}
