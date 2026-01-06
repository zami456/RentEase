import React from "react";

// Function to generate stars based on rating
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating); // Number of full stars
  const halfStars = rating % 1 !== 0 ? 1 : 0; // Half star condition
  const emptyStars = 5 - fullStars - halfStars; // Number of empty stars

  return (
    <div className="flex items-center">
      {/* Full Stars */}
      {Array(fullStars)
        .fill()
        .map((_, index) => (
          <svg key={`full-${index}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400">
            <path d="M10 15l-3.5 2.6 1-4.2-3.5-3.3 4.3-.4L10 3l1.7 6.3 4.3.4-3.5 3.3 1 4.2L10 15z" />
          </svg>
        ))}

      {/* Half Star */}
      {halfStars === 1 && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400">
          <path d="M10 15l-3.5 2.6 1-4.2-3.5-3.3 4.3-.4L10 3l1.7 6.3 4.3.4-3.5 3.3 1 4.2L10 15z" />
          <path d="M10 2l1.6 6.4 6.6.6-4.8 4.6L15 18l-5.4-3.1-5.4 3.1 1.2-6.4-4.8-4.6 6.6-.6L10 2z" />
        </svg>
      )}

      {/* Empty Stars */}
      {Array(emptyStars)
        .fill()
        .map((_, index) => (
          <svg key={`empty-${index}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-300">
            <path d="M10 15l-3.5 2.6 1-4.2-3.5-3.3 4.3-.4L10 3l1.7 6.3 4.3.4-3.5 3.3 1 4.2L10 15z" />
          </svg>
        ))}
    </div>
  );
};

export default RatingStars;