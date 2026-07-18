"use client";

import { useEffect, useState } from "react";

export function useProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { void fetchProfile(); }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (data.admin) { setName(data.admin.name || ""); setEmail(data.admin.email); }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/admin/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      if (res.ok) { setMessage("Profile updated!"); setTimeout(() => setMessage(""), 3000); }
    } catch {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (newPassword !== confirmPassword) return setMessage("Passwords don't match");
    if (newPassword.length < 6) return setMessage("Password must be at least 6 characters");
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/admin/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      const data = await res.json();
      if (res.ok) { setMessage("Password changed!"); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }
      else setMessage(data.error || "Failed to change password");
    } catch {
      setMessage("Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return { name, setName, email, currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, loading, saving, message, handleUpdateProfile, handleChangePassword };
}
