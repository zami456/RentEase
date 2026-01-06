// src/pages/PropertyDetails.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import { Home, Heart, Flag, X } from "lucide-react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import API_BASE from "../config/api";

axios.defaults.withCredentials = true;

const PropertyDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [userId, setUserId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsRefresh, setReviewsRefresh] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  // Optional modal size (CSS max sizes); defaults keep image within viewport
  const [modalImageSize, setModalImageSize] = useState({ width: "90vw", height: "85vh" });

  // Fetch reviews for this property
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reviews/${id}`, {
        withCredentials: true,
      });
      setReviews(res.data.reviews || res.data);
    } catch (err) {
      console.error("fetchReviews error:", err);
    }
  };

  // Fetch property details
  const fetchProperty = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/properties/${id}`, {
        withCredentials: true,
      });
      setProperty(res.data.property);
    } catch (err) {
      console.error("Error fetching property:", err);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/comments/${id}`, {
        withCredentials: true,
      });
      // backend might return array or { comments: [...] }
      setComments(res.data.comments ?? res.data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  // Fetch current session user id (if logged in)
  const fetchUserId = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/auth/session`, {
        withCredentials: true,
      });
      if (response.data.loggedIn) {
        setUserId(response.data.user.id);
      }
    } catch (error) {
      console.error("Failed to fetch user session:", error);
    }
  };

  // Post a new comment (or answer)
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${API_BASE}/api/comments/${id}`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  // Post a reply to a comment
  const handleReplySubmit = async (commentId) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${API_BASE}/api/comments/${commentId}/reply`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      setReplyingTo(null);
      fetchComments();
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  // Like/Dislike a comment
  const handleLikeDislike = async (commentId, type) => {
    try {
      await axios.post(
        `${API_BASE}/api/comments/${type}/${commentId}`,
        {},
        { withCredentials: true }
      );
      fetchComments();
    } catch (err) {
      console.error(`Failed to ${type} comment:`, err);
    }
  };

  // Edit comment
  const handleEditSubmit = async (commentId) => {
    if (!editedContent.trim()) return;
    try {
      await axios.put(
        `${API_BASE}/api/comments/${commentId}`,
        { content: editedContent },
        { withCredentials: true }
      );
      setEditingCommentId(null);
      setEditedContent("");
      fetchComments();
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${API_BASE}/api/comments/${commentId}`, {
        withCredentials: true,
      });
      fetchComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // Add to wishlist (tenant)
  const handleAddToWishlist = async () => {
    if (!userId) {
      alert("You must be logged in to add to wishlist.");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE}/api/wishlist`,
        { userId, propertyId: property._id },
        { withCredentials: true }
      );
      alert(response.data.message || "Added to wishlist!");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      alert("Failed to add to wishlist. Please try again.");
    }
  };

  // Image modal functions
  const openImageModal = (imageUrl, size) => {
    setSelectedImage(imageUrl);
    if (size?.width || size?.height) {
      setModalImageSize({
        width: size.width || "90vw",
        height: size.height || "85vh",
      });
    } else {
      setModalImageSize({ width: "90vw", height: "85vh" });
    }
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage("");
  };

  useEffect(() => {
    fetchProperty();
    fetchComments();
    fetchUserId();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reviewsRefresh]);

  if (!property) return <div className="text-center mt-10">Loading...</div>;

  // Safely dedupe room images and ensure array
  const uniqueRoomImages = Array.from(new Set(property.roomImages || []));

  // Main image url (fallback to placeholder if none)
  const mainImageUrl = (() => {
    const img = property.mainImage && property.mainImage.trim();
    if (!img) return null;
    return img.startsWith("http") ? img : `https://tenantsync-backend.onrender.com${img}`;
  })(); // you can set a placeholder here if you have one

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-2">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md border border-blue-100 mt-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-900 tracking-tight">
          {property.houseName}
        </h1>

        {/* Main Property Image */}
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={property.houseName}
            className="w-full rounded-lg mb-4 border border-blue-200 shadow-sm object-cover max-h-96 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openImageModal(mainImageUrl, { width: "90vw", height: "85vh" })}
          />
        ) : (
          <div className="w-full h-56 rounded-lg mb-4 border border-blue-200 shadow-sm bg-blue-100 flex items-center justify-center text-blue-400">
            No main image provided
          </div>
        )}

        {/* Room Images Gallery */}
        {uniqueRoomImages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">Room Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {uniqueRoomImages.map((image, index) => (
                <img
                  key={index}
                  src={image.startsWith("http") ? image : `https://tenantsync-backend.onrender.com${image}`}
                  alt={`Room ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border border-blue-200 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => {
                    const url = image.startsWith("http")
                      ? image
                      : `https://tenantsync-backend.onrender.com${image}`;
                    openImageModal(url, { width: "90vw", height: "85vh" });
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>

            <p className="text-blue-700 font-semibold">Owner:</p>
            <p className="text-blue-800 mb-2">{property.owner?.username ?? "Unknown"}</p>

            <p className="text-blue-700 font-semibold">Contact:</p>
            <p className="text-blue-800 mb-2">{property.contact}</p>

            <p className="text-blue-700 font-semibold">Price:</p>
            <p className="text-blue-800 mb-2">{property.price}৳</p>
          </div>

          <div>
            <p className="text-blue-700 font-semibold">Rooms:</p>
            <p className="text-blue-800 mb-2">{property.rooms}</p>

            <p className="text-blue-700 font-semibold">Washrooms:</p>
            <p className="text-blue-800 mb-2">{property.washrooms}</p>

            <p className="text-blue-700 font-semibold">Square Feet:</p>
            <p className="text-blue-800 mb-2">{property.squareFeet}</p>
          </div>
        </div>

        {/* Adress */}
        <div className="mb-4">
          <p className="text-blue-700 font-semibold">Adress:</p>
          <p className="text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-100 italic">
            {property.address || "No adress provided."}
          </p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-blue-700 font-semibold">Description:</p>
          <p className="text-blue-800 bg-blue-50 p-3 rounded-lg border border-blue-100 italic">
            {property.description || "No description provided."}
          </p>
        </div>

        <p className="text-xs text-blue-400 mb-6">
          Posted: {moment(property.createdAt).fromNow()}
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate("/payment", { state: { property, user } })}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
          >
            <Home size={18} />
            Rent Now
          </button>

          <button
            onClick={handleAddToWishlist}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-pink-300 flex items-center gap-2"
          >
            <Heart size={18} />
            Add to Wishlist
          </button>

          <Link
            to={`/report/${property._id}`}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center gap-2"
          >
            <Flag size={18} />
            Report
          </Link>
        </div>

        <hr className="my-8 border-blue-100" />

        {/* Reviews */}
        {userId && (
          <div className="mt-8">
            <ReviewList reviews={reviews} refreshReviews={fetchReviews} />
          </div>
        )}
        <div className="mt-8">
          <ReviewForm propertyId={id} userId={userId} onReviewAdded={fetchReviews} />
        </div>

        {/* FAQ / Comments */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-blue-900 tracking-tight text-center">
            FAQ Section
          </h2>

          <textarea
            className="w-full border border-blue-200 bg-blue-50 rounded-xl p-3 mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-900 placeholder-blue-300 shadow-sm transition"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingTo ? "Answering a question..." : "Add a Question here..."}
          ></textarea>

          <div className="flex gap-2 mb-4 justify-end">
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={replyingTo ? () => handleReplySubmit(replyingTo) : handleCommentSubmit}
            >
              {replyingTo ? "Reply" : "Post"}
            </button>

            <button
              className="text-sm text-blue-400 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
              onClick={() => {
                setReplyingTo(null);
                setNewComment("");
              }}
            >
              Cancel
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {comments.map((c) => (
              <div
                key={c._id}
                className="border border-blue-100 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm"
              >
                <div className="text-xs text-blue-500 mb-1 flex items-center gap-2">
                  <span className="font-semibold text-blue-700">
                    {c.author?.username || "Unknown"}
                  </span>
                  <span className="text-blue-300">•</span>
                  <span>{moment(c.createdAt).fromNow()}</span>
                </div>

                {editingCommentId === c._1d ? (
                  <>
                    <textarea
                      className="w-full border border-blue-200 bg-blue-50 rounded-lg p-2 mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-900 placeholder-blue-300 shadow-sm"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 text-sm font-semibold shadow"
                        onClick={() => handleEditSubmit(c._id)}
                      >
                        Save
                      </button>
                      <button
                        className="text-sm text-blue-400 hover:text-blue-600 px-3 py-1 rounded-lg transition-colors"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditedContent("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="mb-2 text-blue-900 text-base leading-relaxed">{c.content}</p>
                )}

                <div className="flex flex-wrap gap-4 text-xs text-blue-600 mt-1">
                  <span
                    className="cursor-pointer hover:text-blue-800"
                    onClick={() => handleLikeDislike(c._id, "like")}
                  >
                    👍 {c.likes?.length ?? 0}
                  </span>
                  <span
                    className="cursor-pointer hover:text-blue-800"
                    onClick={() => handleLikeDislike(c._id, "dislike")}
                  >
                    👎 {c.dislikes?.length ?? 0}
                  </span>
                  <span
                    className="cursor-pointer hover:text-blue-800"
                    onClick={() => {
                      setReplyingTo(c._id);
                      setNewComment("");
                    }}
                  >
                    Reply
                  </span>
                </div>

                {c.replies?.map((r) => (
                  <div
                    key={r._id}
                    className="ml-6 mt-3 text-sm border-l-4 border-blue-200 pl-4 italic bg-blue-100 rounded-xl py-2"
                  >
                    <strong className="text-blue-700">{r.author?.username}:</strong>{" "}
                    {r.content}{" "}
                    <span className="text-xs text-blue-400">{moment(r.createdAt).fromNow()}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity z-10"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Full size view"
              className="object-contain rounded-lg"
              style={{ maxWidth: modalImageSize.width, maxHeight: modalImageSize.height }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;