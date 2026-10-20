"use client";

import { useState, useRef } from "react";
import {
  Building2,
  Mail,
  Phone,
  Globe,
  ImagePlus,
  Save,
  Loader2,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";

interface GeneralSettingsForm {
  companyName: string;
  systemName: string;
  email: string;
  phone: string;
  website: string;
  timezone: string;
  currency: string;
  language: string;
}

const initialForm: GeneralSettingsForm = {
  companyName: "RealBiz",
  systemName: "RealBiz ERP",
  email: "admin@realbiz.com",
  phone: "+880 1XXXXXXXXX",
  website: "https://realbiz.com",
  timezone: "Asia/Dhaka (GMT+6)",
  currency: "BDT — Bangladeshi Taka",
  language: "English",
};

function FormField({
  label,
  icon: Icon,
  ...props
}: {
  label: string;
  icon: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          {...props}
          className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}

export default function GeneralSettings() {
  const [form, setForm] = useState<GeneralSettingsForm>(initialForm);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (field: keyof GeneralSettingsForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLogoPreview(url);
  };

  const handleSave = () => {
    setSaveState("saving");
    // TODO: replace with actual API call
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 1200);
  };

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage basic information and system preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saveState === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : saveState === "saved" ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        {/* Company Identity */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <Building2 className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-sm font-semibold">Company Identity</h2>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Logo uploader */}
            <div className="flex flex-col items-center gap-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-background transition hover:border-primary"
              >
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview}
                    alt="Company logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-6 w-6 text-muted-foreground transition group-hover:text-primary" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-primary hover:underline"
              >
                Upload logo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>

            {/* Name fields */}
            <div className="grid flex-1 gap-5 sm:grid-cols-2">
              <FormField
                label="Company Name"
                icon={Building2}
                type="text"
                value={form.companyName}
                onChange={handleChange("companyName")}
              />
              <FormField
                label="System Name"
                icon={Globe}
                type="text"
                value={form.systemName}
                onChange={handleChange("systemName")}
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <Mail className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-sm font-semibold">Contact Information</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />
            <FormField
              label="Phone"
              icon={Phone}
              type="text"
              value={form.phone}
              onChange={handleChange("phone")}
            />
            <FormField
              label="Website"
              icon={Globe}
              type="text"
              value={form.website}
              onChange={handleChange("website")}
            />
          </div>
        </div>

        {/* Regional Preferences */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-sm font-semibold">Regional Preferences</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <FormField
              label="Timezone"
              icon={Clock}
              type="text"
              value={form.timezone}
              onChange={handleChange("timezone")}
            />
            <FormField
              label="Currency"
              icon={DollarSign}
              type="text"
              value={form.currency}
              onChange={handleChange("currency")}
            />
            <FormField
              label="Language"
              icon={Globe}
              type="text"
              value={form.language}
              onChange={handleChange("language")}
            />
          </div>
        </div>

        {/* Bottom Save (mobile-friendly duplicate) */}
        <div className="flex justify-end sm:hidden">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveState === "saving"}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-70"
          >
            {saveState === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saveState === "saving" ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
