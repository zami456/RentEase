import React, { useState } from "react";
import axios from "axios";
import API_BASE from "../config/api";

export default function ReviewForm({ propertyId, userId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || reviewText.trim() === "") {
      setError("Please provide a rating and a review.");
      return;
    }
    try {
      await axios.post(`${API_BASE}/api/reviews/add`, {
        propertyId,
        userId,
        rating,
        comment: reviewText,
      });
      setSuccess("Review submitted successfully!");
      setRating(0);
      setReviewText("");
      setError("");
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "There was an error submitting your review."
      );
    }
  };

  return (
    <div className="review-form max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg mt-8 border border-blue-200">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h3 className="text-2xl font-bold mb-2 text-blue-900 tracking-tight text-center">
          Leave a Review
        </h3>
        <div className="flex flex-col gap-2">
          <label className="text-blue-700 font-medium text-sm">Rating</label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-9 h-9 cursor-pointer transition-colors duration-150 ${
                  (hover || rating) >= star ? "text-blue-500" : "text-blue-200"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <path d="M10 15l-3.5 2.6 1-4.2-3.5-3.3 4.3-.4L10 3l1.7 6.3 4.3.4-3.5 3.3 1 4.2L10 15z" />
              </svg>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-blue-700 font-medium text-sm">Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            placeholder="Share your experience..."
            className="w-full border border-blue-200 bg-blue-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-blue-900 placeholder-blue-300 resize-none shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold tracking-wide shadow-md"
        >
          Submit Review
        </button>
        {error && (
          <div className="text-center mt-1 text-blue-600 bg-blue-100 border border-blue-200 rounded p-2 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="text-center mt-1 text-blue-700 bg-blue-50 border border-blue-200 rounded p-2 text-sm">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}