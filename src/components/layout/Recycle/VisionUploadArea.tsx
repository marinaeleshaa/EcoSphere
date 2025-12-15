"use client";

import React, { useRef, useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface VisionUploadAreaProps {
  onFilesChange: (files: File[]) => void;
  error: string | null;
}

const VisionUploadArea = ({ onFilesChange, error }: VisionUploadAreaProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    if (validFiles.length > 0) {
      // Append new files
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles); // Notify parent

      // Create previews
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = () => {
    setFiles([]);
    setPreviews([]);
    onFilesChange([]); // Notify parent
  };

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <motion.div
        className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-4xl border-4 border-dashed transition-all duration-300 ${
          dragActive
            ? "border-primary-foreground bg-primary-foreground/10 scale-[1.01]"
            : "border-primary-foreground/30 hover:border-foreground/60 hover:bg-foreground/5"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        <div className="text-center space-y-2 max-w-md px-4 pointer-events-none">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-foreground/10 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-foreground" />
          </div>
          <h3 className="text-xl font-bold">Add Images</h3>
          <p className="text-foreground/70 text-sm">
            Drag & drop or click to upload
          </p>
        </div>
      </motion.div>

      {/* Action Button & Summary */}
      {files.length > 0 && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {/* Compact File Summary */}
          <div className="flex items-center gap-3 px-5 py-2 bg-primary-foreground/10 rounded-full border border-primary-foreground/20">
            <div className="flex -space-x-2">
              {previews.slice(0, 3).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="thumb"
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
              ))}
              {files.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-primary-foreground text-primary text-xs font-bold flex items-center justify-center border-2 border-background">
                  +{files.length - 3}
                </div>
              )}
            </div>
            <span className="font-bold text-sm">
              {files.length} Image{files.length > 1 ? "s" : ""} Ready
            </span>
            <button
              type="button" // Ensure it doesn't submit form
              onClick={handleRemoveImage}
              className="p-1 hover:bg-red-500/20 text-red-400 rounded-full transition-colors"
            >
              <AlertCircle size={16} className="rotate-45" />{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Sparkles icon locally since it wasn't imported
const SparklesIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M9 5h4" />
  </svg>
);

export default VisionUploadArea;
