"use client";

import { useState } from "react";
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldOff,
} from "lucide-react";

interface PasswordForm {
  current: string;
  newPass: string;
  confirm: string;
}

export default function SecuritySettings() {
  const [form, setForm] = useState<PasswordForm>({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Partial<PasswordForm>>({});
  const [passwordState, setPasswordState] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

  const handleChange =
    (field: keyof PasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // typing শুরু হলে relevant error clear করে দেওয়া
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const toggleShow = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<PasswordForm> = {};

    if (!form.current) {
      newErrors.current = "Current password is required.";
    }

    if (!form.newPass) {
      newErrors.newPass = "New password is required.";
    } else if (form.newPass.length < 8) {
      newErrors.newPass = "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(form.newPass) || !/[0-9]/.test(form.newPass)) {
      newErrors.newPass =
        "Password must include at least one uppercase letter and one number.";
    }

    if (!form.confirm) {
      newErrors.confirm = "Please confirm your new password.";
    } else if (form.newPass && form.confirm !== form.newPass) {
      newErrors.confirm = "Passwords do not match.";
    }

    if (form.current && form.newPass && form.current === form.newPass) {
      newErrors.newPass =
        "New password must be different from current password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = () => {
    if (!validate()) return;

    setPasswordState("saving");

    // TODO: replace with actual API call
    setTimeout(() => {
      // simulate wrong current-password error from server (demo only)
      const simulatedServerError = false;

      if (simulatedServerError) {
        setErrors({ current: "Current password is incorrect." });
        setPasswordState("idle");
        return;
      }

      setPasswordState("saved");
      setForm({ current: "", newPass: "", confirm: "" });
      setTimeout(() => setPasswordState("idle"), 2000);
    }, 1200);
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorLoading(true);
    // TODO: replace with actual API call
    setTimeout(() => {
      setTwoFactorEnabled((prev) => !prev);
      setTwoFactorLoading(false);
    }, 900);
  };

  const passwordFields: {
    key: keyof PasswordForm;
    label: string;
    placeholder: string;
  }[] = [
    {
      key: "current",
      label: "Current Password",
      placeholder: "Current Password",
    },
    { key: "newPass", label: "New Password", placeholder: "New Password" },
    {
      key: "confirm",
      label: "Confirm New Password",
      placeholder: "Confirm New Password",
    },
  ];

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Security</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Protect your Super Admin account and system.
        </p>
      </div>

      <div className="space-y-5">
        {/* Change Password */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">Change Password</h3>
              <p className="text-sm text-muted-foreground">
                Update your account password.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {passwordFields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <div className="relative">
                  <input
                    type={showPassword[key] ? "text" : "password"}
                    value={form[key]}
                    onChange={handleChange(key)}
                    placeholder={placeholder}
                    disabled={passwordState === "saving"}
                    className={`w-full rounded-lg border bg-background px-3 py-2.5 pr-10 outline-none transition focus:ring-2 ${
                      errors[key]
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-input focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(key)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword[key] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors[key] && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors[key]}
                  </p>
                )}
              </div>
            ))}

            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters and include one uppercase
              letter and one number.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={passwordState === "saving"}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {passwordState === "saving" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : passwordState === "saved" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Updated
                </>
              ) : (
                "Update Password"
              )}
            </button>

            {passwordState === "saved" && (
              <span className="text-sm text-green-600">
                Password changed successfully.
              </span>
            )}
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              {twoFactorEnabled ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-primary" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Two-Factor Authentication</h3>
                  {twoFactorEnabled && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                      Enabled
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleTwoFactor}
              disabled={twoFactorLoading}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70 ${
                twoFactorEnabled
                  ? "border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {twoFactorLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : twoFactorEnabled ? (
                <ShieldOff className="h-4 w-4" />
              ) : null}
              {twoFactorLoading
                ? "Please wait..."
                : twoFactorEnabled
                  ? "Disable"
                  : "Enable"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
