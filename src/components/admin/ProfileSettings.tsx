"use client";

import { useState, useRef } from "react";
import {
  Camera,
  Save,
  User,
  Mail,
  Phone,
  ShieldCheck,
  X,
  Loader2,
  CheckCircle2,
  FileText,
  Pencil,
} from "lucide-react";

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
}

function FormField({
  label,
  icon: Icon,
  textarea,
  ...props
}: {
  label: string;
  icon: React.ElementType;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon
          className={`pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground ${
            textarea ? "top-3" : "top-1/2 -translate-y-1/2"
          }`}
        />
        {textarea ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={3}
            className="w-full resize-none rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        )}
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  const initialForm: ProfileForm = {
    firstName: "Rana",
    lastName: "Khan",
    email: "admin@realbiz.com",
    phone: "",
    bio: "",
  };

  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [draftForm, setDraftForm] = useState<ProfileForm>(initialForm);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateState, setUpdateState] = useState<"idle" | "saving" | "done">(
    "idle",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = (form.firstName[0] ?? "") + (form.lastName[0] ?? "");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const openUpdateModal = () => {
    setDraftForm(form); // modal খুলার সময় current data দিয়ে prefill
    setUpdateState("idle");
    setModalOpen(true);
  };

  const handleDraftChange =
    (field: keyof ProfileForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraftForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const confirmUpdate = () => {
    setUpdateState("saving");
    // TODO: replace with actual API call, sending draftForm
    setTimeout(() => {
      setForm(draftForm); // save করে main state আপডেট
      setUpdateState("done");
      setTimeout(() => {
        setModalOpen(false);
        setUpdateState("idle");
      }, 1200);
    }, 1200);
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your Super Admin profile information.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {/* Avatar + identity */}
        <div className="mb-6 flex flex-col items-center gap-5 border-b border-border pb-6 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="relative">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Profile avatar"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {initials || "SA"}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 rounded-full border border-border bg-background p-2 shadow transition hover:bg-muted"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-semibold">
                {form.firstName} {form.lastName}
              </h3>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrator
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={openUpdateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Pencil className="h-4 w-4" />
            Update Profile
          </button>
        </div>

        {/* Read-only summary view */}
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              First Name
            </p>
            <p className="mt-1 text-sm">{form.firstName || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Last Name
            </p>
            <p className="mt-1 text-sm">{form.lastName || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Email</p>
            <p className="mt-1 text-sm">{form.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Phone Number
            </p>
            <p className="mt-1 text-sm">{form.phone || "—"}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-medium text-muted-foreground">Bio</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {form.bio || "No bio added yet."}
            </p>
          </div>
        </div>
      </div>

      {/* Update Modal with editable form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => updateState !== "saving" && setModalOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal panel */}
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl">
            {updateState !== "saving" && (
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {updateState === "done" ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="mb-3 h-12 w-12 text-green-500" />
                <h3 className="text-lg font-semibold">Profile Updated</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your changes have been saved successfully.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Update Profile</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Edit the fields below and save your changes.
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <FormField
                    label="First Name"
                    icon={User}
                    value={draftForm.firstName}
                    onChange={handleDraftChange("firstName")}
                    placeholder="First Name"
                    disabled={updateState === "saving"}
                  />
                  <FormField
                    label="Last Name"
                    icon={User}
                    value={draftForm.lastName}
                    onChange={handleDraftChange("lastName")}
                    placeholder="Last Name"
                    disabled={updateState === "saving"}
                  />
                  <FormField
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={draftForm.email}
                    onChange={handleDraftChange("email")}
                    placeholder="Email"
                    disabled={updateState === "saving"}
                  />
                  <FormField
                    label="Phone Number"
                    icon={Phone}
                    value={draftForm.phone}
                    onChange={handleDraftChange("phone")}
                    placeholder="Phone Number"
                    disabled={updateState === "saving"}
                  />
                  <div className="sm:col-span-2">
                    <FormField
                      label="Bio"
                      icon={FileText}
                      textarea
                      value={draftForm.bio}
                      onChange={handleDraftChange("bio")}
                      placeholder="A short description about yourself..."
                      disabled={updateState === "saving"}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={updateState === "saving"}
                    className="rounded-lg border border-input px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmUpdate}
                    disabled={updateState === "saving"}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-70"
                  >
                    {updateState === "saving" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
