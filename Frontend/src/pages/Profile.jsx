import React, { useEffect, useState } from "react";
import { Avatar } from "../components/common/Avatar.jsx";

export default function ProfilePage({ profile, onSaveProfile, profileImage, onUploadAvatar }) {
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setDraft(profile), [profile]);

  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await onUploadAvatar(file);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      await onSaveProfile(draft);
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  };

  return <div className="page-content simple-page"><div className="welcome-row"><div><p className="eyebrow">YOUR ACCOUNT</p><h1>Your profile</h1><p className="muted">Manage how you show up across your workspace.</p></div></div><section className="panel profile-settings"><div className="profile-photo-row"><div className="profile-photo">{profileImage ? <img src={profileImage} alt="Your profile" /> : <Avatar person={0} size="photo-avatar" />}</div><div><h2>Profile photo</h2><p>Choose an image that teammates will recognize.</p><label className="button button-outline upload-button">{busy ? "Uploading..." : "Upload photo"}<input type="file" accept="image/*" onChange={uploadAvatar} disabled={busy} /></label></div></div><div className="profile-form"><label>Full name<input value={draft.name} onChange={(event) => update("name", event.target.value)} /></label><label>Email address<input type="email" value={draft.email} readOnly /></label><label>Role<input value={draft.role} readOnly /></label></div><div className="profile-save-row"><span>{error || (saved ? "Your profile is up to date." : "Your profile is only visible to your workspace.")}</span><button className="button button-primary" onClick={save} disabled={busy}>{busy ? "Saving..." : "Save changes"}</button></div></section></div>;
}
