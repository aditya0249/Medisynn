import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Edit3, Save, Camera } from "lucide-react";

const API = "http://localhost:5000";

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    password: "",
    profile_image: "", // backend filename
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef();

  // Load profile
useEffect(() => {
  const storedEmail = localStorage.getItem("userEmail");

  fetch(`${API}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: storedEmail }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data) return;

      let filename = null;

      if (data.profile_image) {
        // data.profile_image is a FULL URL: http://localhost:5000/uploads/abc.jpg
        const parts = data.profile_image.split("/uploads/");
        filename = parts[1] || null;
      }

      setProfile({
        full_name: data.full_name,
        email: data.email,
        password: "",
        profile_image: filename, // NULL or filename
      });
    })
    .catch(() => {});
}, []);


  // Handle selecting a new image
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setProfile((p) => ({
      ...p,
      profile_image_preview: URL.createObjectURL(file),
    }));
  };

  // DELETE PROFILE IMAGE
const handleDeleteImage = async () => {
  try {
    const res = await fetch(`${API}/delete-profile-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        filename: profile.profile_image,
      }),
    });

    if (res.ok) {
      toast.success("Profile photo deleted!");
      setProfile((p) => ({
        ...p,
        profile_image: null,   // FIX
      }));
      setSelectedImage(null);
      setIsEditing(true);

    } else {
      toast.error("Error deleting image");
    }
  } catch {
    toast.error("Error deleting image");
  }
};




  // Save profile + upload image
// Save profile + upload image
const handleSave = async () => {
  console.log("HANDLE SAVE TRIGGERED");

  try {
    let finalImage = profile.profile_image;  // keep exact value

    // Convert empty string to null (delete case)
    if (finalImage === "") finalImage = null;

    // ----------- IMAGE UPLOAD -----------
    if (selectedImage) {
      const fd = new FormData();
      fd.append("image", selectedImage);
      fd.append("email", profile.email);

      const uploadRes = await fetch(`${API}/upload-profile-image`, {
        method: "POST",
        body: fd,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        toast.error("Image upload failed");
        return;
      }

      finalImage = uploadData.filename;
    }

    // ----------- PROFILE UPDATE -----------
    const res = await fetch(`${API}/update-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        full_name: profile.full_name,
        password: profile.password || null,
        profile_image: finalImage,  // <-- ALWAYS SEND
      }),
    });

    console.log("SENT BODY:", {
      email: profile.email,
      full_name: profile.full_name,
      password: profile.password || null,
      profile_image: finalImage,
    });

    if (res.ok) {
      toast.success("Profile updated!");

      setProfile({
        ...profile,
        profile_image: finalImage,
        password: "",
      });

      setSelectedImage(null);
      setIsEditing(false);
    } else {
      toast.error("Error updating profile");
    }
  } catch (err) {
    toast.error("Server error");
  }
};







  // Final profile photo URL
  const profileImageURL = selectedImage
    ? profile.profile_image_preview
    : profile.profile_image
    ? `${API}/uploads/${profile.profile_image}`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // default avatar

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-500 animate-fade-in-smooth">
        <CardHeader className="text-center">
  <div className="relative w-24 h-24 mx-auto">

    {/* Profile Image */}
    <img
      src={profileImageURL}
      className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow"
    />

    {/* Camera Button */}
    <button
      className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow cursor-pointer"
      onClick={() => fileInputRef.current.click()}
    >
      <Camera className="w-4 h-4 text-white" />
    </button>

    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      className="hidden"
      onChange={handleImageSelect}
    />
  </div>

  {/* Change Photo */}
  <button
    className="text-blue-600 font-semibold mt-2"
    onClick={() => fileInputRef.current.click()}
  >
    Change Photo
  </button>

  {/* Delete Photo (now always shows correctly) */}
  {profile.profile_image !== null &&
    profile.profile_image !== "" &&
    (
      <button
        className="text-red-600 text-sm font-semibold underline mt-1"
        onClick={handleDeleteImage}
      >
        Delete Photo
      </button>
  )}

  <CardTitle className="mt-3 text-2xl font-bold text-gray-800">
    Your Profile
  </CardTitle>
</CardHeader>


        <CardContent className="space-y-4">
          {/* Full Name */}
          <div>
            <Label>Full Name</Label>
            <div className="flex items-center gap-2">
              <Input
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                disabled={!isEditing}
              />
              <Edit3
                className="w-5 h-5 cursor-pointer text-gray-500 hover:text-blue-600"
                onClick={() => setIsEditing(true)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Input value={profile.email} disabled />
              <Mail className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* New Password */}
          {isEditing && (
            <div>
              <Label>New Password (optional)</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                onChange={(e) =>
                  setProfile({ ...profile, password: e.target.value })
                }
              />
            </div>
          )}

          {/* Save / Edit Button */}
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="w-full gradient-hero text-white mt-4"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
