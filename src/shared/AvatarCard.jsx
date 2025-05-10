import React, { memo } from "react";

const AvatarCard = ({
  avatar = [],
  name = "User",
  alt = "User Avatar",
  size = "md",
  max = 4,
  isOnline = false,
}) => {
  // Define size variations
  const sizeClasses = {
    ex: "w-6 h-6 text-xs",
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-base",
    lg: "w-20 h-20 text-lg",
    xl: "w-28 h-28 text-xl",
    el: "w-46 h-46 text-xl",
  };

  // Get the first letter of the name (fallback for missing image)
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex items-center">
      {avatar.length > 0 ? (
        <div className="flex -space-x-7 rtl:space-x-reverse">
          {avatar?.slice(0, max)?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={alt}
              className={`rounded-full border-2 border-white shadow-md object-fit ${sizeClasses[size]}`}
            />
          ))}

          {avatar.length > max && (
            <div
              className={`flex items-center justify-center bg-gray-500 text-white font-semibold rounded-full border-2 border-white shadow-md ${sizeClasses[size]}`}
            >
              +{avatar.length - max}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex items-center justify-center bg-gray-300 text-gray-700 font-semibold rounded-full border-2 border-white shadow-md ${sizeClasses[size]}`}
        >
          {initials}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default memo(AvatarCard);
