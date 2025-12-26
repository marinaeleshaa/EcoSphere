"use client";
import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";

interface NewsPostCardProps {
  title?: string;
  content?: string;
  image?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function NewsPostCard({
  title = "Breaking: New Technology Revolutionizes Industry",
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  image = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
  onEdit,
  onDelete,
}: Readonly<NewsPostCardProps>) {
  const handleEdit = () => {
    if (onEdit) onEdit();
    console.log("Edit clicked");
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
    console.log("Delete clicked");
  };

  return (
    <div className="bg-primary/5 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-56 md:h-auto overflow-hidden shrink-0">
          <Image
            width={900}
            height={900}
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between p-6 grow">
          <div>
            {/* Title */}
            <h3 className="text-2xl font-bold text-primary mb-3 line-clamp-2">
              {title}
            </h3>

            {/* Post Content */}
            <p className="text-foreground/60 mb-6 line-clamp-3 leading-relaxed">
              {content}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-primary">
            <button onClick={handleEdit} className="myBtnPrimary">
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              className="myBtnPrimary bg-red-500/50! hover:bg-red-500/70! hover:outline-red-500/50! text-white! "
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
