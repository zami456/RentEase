import React from "react";

export default function ReviewList({ reviews }) {
  return (
    <div className="review-list max-w-lg mx-auto mt-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 border border-blue-200">
      <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center tracking-tight">
        Reviews
      </h3>
      {reviews.length > 0 ? (
        <div className="flex flex-col gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white/70 border border-blue-100 rounded-xl p-4 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-800 text-base">
                  {review.userId?.username || "User"}
                </span>
                <span className="flex items-center gap-1 ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={`w-5 h-5 ${
                        review.rating >= star
                          ? "text-blue-500"
                          : "text-blue-200"
                      }`}
                    >
                      <path d="M10 15l-3.5 2.6 1-4.2-3.5-3.3 4.3-.4L10 3l1.7 6.3 4.3.4-3.5 3.3 1 4.2L10 15z" />
                    </svg>
                  ))}
                </span>
              </div>
              <p className="text-blue-900 text-sm leading-relaxed">
                {review.comment}
              </p>
              <p className="text-xs text-blue-400 text-right mt-1">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-blue-400">No reviews yet.</p>
      )}
    </div>
  );
}