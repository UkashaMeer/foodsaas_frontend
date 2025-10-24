import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";

export default function EditProfile() {
  return (
    <div className="container space-y-6">
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
}
