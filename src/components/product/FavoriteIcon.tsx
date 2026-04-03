"use client";

import { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { Heart } from "lucide-react";

interface FavoriteIconProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function FavoriteIcon({
  isFavorite,
  onToggle,
  size = "md",
}: FavoriteIconProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const iconSize = sizeMap[size];

  return (
    <IconButton
      aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
      variant="ghost"
      size="sm"
      onClick={handleClick}
      color={isFavorite ? "red.500" : "gray.400"}
      _hover={{ color: "red.500" }}
      transition="transform 0.2s, color 0.2s"
      transform={isAnimating ? "scale(1.2)" : "scale(1)"}
    >
      <Heart size={iconSize} fill={isFavorite ? "currentColor" : "none"} />
    </IconButton>
  );
}
