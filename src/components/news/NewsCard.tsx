"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface NewsCardProps {
    title: string;
    description: string;
    image: string;
    link: string;
    buttonText?: string;
}

const NewsCard = ({
    title,
    description,
    image,
    link,
    buttonText = "View More",
}: NewsCardProps) => {
    return (
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-6 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-md">
            {/* Avatar / Image Section */}
            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                    {description}
                </p>
            </div>

            {/* Button Section */}
            <div className="shrink-0">
                <Link
                    href={link}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    {buttonText}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default NewsCard;
