import { useState } from "react";
import { Heart } from "lucide-react";

const FavoriteButton = ({ 
  propertyId, 
  isFavorited, 
  onToggle, 
  className = "",
  size = "default" 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAnimating) return; // Prevent multiple clicks during animation
    
    setIsAnimating(true);
    
    try {
      onToggle(propertyId);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizeClasses = {
    small: "w-8 h-8 p-1",
    default: "w-10 h-10 p-2", 
    large: "w-12 h-12 p-3"
  };

  const iconSizes = {
    small: 16,
    default: 20,
    large: 24
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]} 
        ${className}
        focus:outline-none 
        bg-white 
        rounded-md 
        shadow-md 
        hover:bg-gray-100 
        transition-all 
        duration-200
        relative
        overflow-hidden
        group
      `}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Animated heart with pulse effect */}
      <div className="relative">
        <Heart
          size={iconSizes[size]}
          className={`
            transition-all 
            duration-300 
            ${isFavorited ? "text-red-500" : "text-gray-400"}
            ${isAnimating ? "scale-125" : "scale-100"}
            ${isFavorited && isAnimating ? "animate-pulse" : ""}
            group-hover:scale-110
          `}
          fill={isFavorited ? "currentColor" : "none"}
        />
        
        {/* Ripple effect on click */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-md bg-red-200 opacity-30 animate-ping" />
        )}
        
        {/* Sparkle effect for new favorites */}
        {isAnimating && !isFavorited && (
          <div className="absolute -top-1 -right-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          </div>
        )}
      </div>
      
      {/* Subtle glow effect when favorited */}
      {isFavorited && (
        <div className="absolute inset-0 rounded-md bg-red-100 opacity-20 animate-pulse" />
      )}
    </button>
  );
};

export default FavoriteButton;
