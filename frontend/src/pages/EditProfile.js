import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config/api";

const EditProfile = ({ user }) => {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    about: "",
    profileImage: "", // Store Base64 string here
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/profile/${user.id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, profileImage: reader.result })); // Set Base64 string
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/profile/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(profileData), // Send profile data as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setSuccess("Profile updated successfully!");
      navigate("/profile");
      setProfileData(updatedProfile);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this profile? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE}/api/profile/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete profile");
      }

      alert("Profile deleted successfully!");
      navigate("/register"); // Redirect to the home page or another page after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <span className="text-blue-400 text-lg">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <span className="text-blue-600 text-lg">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-lg border border-blue-100">
        <h1 className="text-3xl font-semibold text-blue-700 mb-8 text-center tracking-tight">
          Edit Profile
        </h1>
        {success && (
          <div className="text-center text-blue-500 mb-4">{success}</div>
        )}
        {error && <div className="text-center text-blue-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <label className="font-medium text-blue-700">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {profileData.profileImage && (
              <img
                src={profileData.profileImage}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full border-4 border-blue-200 mt-2 object-cover shadow"
              />
            )}
          </div>
          <div>
            <label className="block text-blue-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder-blue-300"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-blue-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder-blue-300"
              placeholder="Email"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-blue-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder-blue-300"
                placeholder="First Name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-blue-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder-blue-300"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-blue-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder-blue-300"
              placeholder="Phone"
            />
          </div>
          <div>
            <label className="block text-blue-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder-blue-300"
              placeholder="Address"
            />
          </div>
          <div>
            <label className="block text-blue-700 mb-1">About</label>
            <textarea
              name="about"
              value={profileData.about}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-blue-50 text-blue-900 placeholder-blue-300 min-h-[80px]"
              placeholder="Tell us about yourself..."
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="bg-blue-100 text-blue-700 px-6 py-2 rounded-lg font-semibold border border-blue-200 hover:bg-blue-200 transition-colors"
            >
              Delete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;