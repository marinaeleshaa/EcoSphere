"use client";

interface BranchMapProps {
  shopName: string;
  location?: string;
}

const BranchMap = ({ shopName, location }: BranchMapProps) => {
  const query = location ? `${shopName} ${location}` : `${shopName} branches`;

  const encoded = encodeURIComponent(query);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-border">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${encoded}&output=embed`}
        title={`${shopName} Branches`}
      />
    </div>
  );
};

export default BranchMap;
