import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>({}); // Define a proper type later
  const [loading, setLoading] = useState(true);
  const [isNewProfile, setIsNewProfile] = useState(false); // Track if it's a new profile

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const res = await fetch(`/api/profile?userId=${user.uid}`);
        const data = await res.json();

        if (!data) {
          // If no profile exists, set default values
          setProfile({
            name: "",
            email: user.email || "",
            profilePicture: "",
            preferences: {},
          });
          setIsNewProfile(true); // Set the new profile flag
        } else {
          setProfile(data);
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...profile, userId: user?.uid }),
    });
    alert("Profile updated successfully!");
  };

  if (loading)
    return <div className="text-center text-neutral">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-neutral">
        {isNewProfile ? "Create Your Profile" : "User Profile"}
      </h1>

      <label className="block text-sm font-medium text-neutral">Name</label>
      <input
        type="text"
        value={profile.name || ""}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        className="w-full px-4 py-2 border border-lightNeutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <label className="block text-sm font-medium text-neutral mt-4">
        Email
      </label>
      <input
        type="email"
        value={profile.email || ""}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        className="w-full px-4 py-2 border border-lightNeutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        disabled // Prevent changing email if it’s fetched from authentication
      />

      <label className="block text-sm font-medium text-neutral mt-4">
        Profile Picture URL
      </label>
      <input
        type="text"
        value={profile.profilePicture || ""}
        onChange={(e) =>
          setProfile({ ...profile, profilePicture: e.target.value })
        }
        className="w-full px-4 py-2 border border-lightNeutral rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        onClick={handleSave}
        className="mt-6 w-full bg-primary text-white py-3 rounded-lg hover:bg-accentDark transition duration-300"
      >
        {isNewProfile ? "Create Profile" : "Save Profile"}
      </button>
    </div>
  );
}
