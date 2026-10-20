"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  createOrganizationUser,
  updateOrganizationUser,
  type CreateOrganizationUserPayload,
  type OrganizationUser,
  type UpdateOrganizationUserPayload,
} from "@/services/organizationUserService";

import { useTheme } from "@/lib/theme";

const organizationUserSchema = z
  .object({
    firstName: z.string().min(1, "Name is required"),
    lastName: z.string().optional(),

    username: z.string().min(2, "Username is required"),

    email: z.string().email("Enter a valid email address"),

    phone: z.string().optional(),

    password: z.string().optional(),
    confirmPassword: z.string().optional(),

    employeeId: z.string().optional(),

    designationId: z.string().optional(),
    distributionId: z.string().optional(),
    warehouseId: z.string().optional(),
    factoryId: z.string().optional(),
    receivingPointId: z.string().optional(),
    unitId: z.string().optional(),

    organizationName: z.string().optional(),
    organizationId: z.string().optional(),

    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.password && data.password.length < 6) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 6 characters.",
      });
    }

    if (data.password !== data.confirmPassword) {
      if (data.password || data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match.",
        });
      }
    }
  });

type FormValues = z.infer<typeof organizationUserSchema>;

interface OrganizationUserFormProps {
  user: OrganizationUser | null;
  onSuccess: (user: OrganizationUser) => void;
  onCancel: () => void;
}

export default function OrganizationUserForm({
  user,
  onSuccess,
  onCancel,
}: OrganizationUserFormProps) {
  const { primaryColor } = useTheme();

  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    user?.avatarUrl ?? null,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isEdit = Boolean(user);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(organizationUserSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",

      password: "",
      confirmPassword: "",

      employeeId: "",

      designationId: "",
      distributionId: "",
      warehouseId: "",
      factoryId: "",
      receivingPointId: "",
      unitId: "",

      organizationName: "",
      organizationId: "",

      isActive: true,
    },
  });

  useEffect(() => {
    reset({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",

      password: "",
      confirmPassword: "",

      employeeId:
        user?.employeeId !== undefined && user?.employeeId !== null
          ? String(user.employeeId)
          : "",

      designationId:
        user?.designationId !== undefined && user?.designationId !== null
          ? String(user.designationId)
          : "",

      distributionId:
        user?.distributionId !== undefined && user?.distributionId !== null
          ? String(user.distributionId)
          : "",

      warehouseId:
        user?.warehouseId !== undefined && user?.warehouseId !== null
          ? String(user.warehouseId)
          : "",

      factoryId:
        user?.factoryId !== undefined && user?.factoryId !== null
          ? String(user.factoryId)
          : "",

      receivingPointId:
        user?.receivingPointId !== undefined && user?.receivingPointId !== null
          ? String(user.receivingPointId)
          : "",

      unitId:
        user?.unitId !== undefined && user?.unitId !== null
          ? String(user.unitId)
          : "",

      organizationName: user?.organizationName ?? "",

      organizationId:
        user?.organizationId !== undefined && user?.organizationId !== null
          ? String(user.organizationId)
          : "",

      isActive: user?.isActive ?? true,
    });

    setLogoPreview(user?.avatarUrl ?? null);
  }, [user, reset]);

  const password = watch("password");

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be smaller than 5MB.");
      return;
    }

    const url = URL.createObjectURL(file);

    setLogoPreview(url);
  };

  const submit = async (values: FormValues) => {
    try {
      setSaving(true);

      const passwordValue = values.password?.trim();

      if (!isEdit && !passwordValue) {
        toast.error("Password is required.");
        return;
      }

      const commonFields = {
        firstName: values.firstName.trim(),

        lastName: values.lastName?.trim() || "",

        username: values.username.trim(),

        email: values.email.trim(),

        phone: values.phone?.trim() || undefined,

        employeeId: values.employeeId?.trim() ? Number(values.employeeId.trim()) : undefined,

        designationId: values.designationId
          ? Number(values.designationId)
          : undefined,

        distributionId: values.distributionId
          ? Number(values.distributionId)
          : undefined,

        warehouseId: values.warehouseId
          ? Number(values.warehouseId)
          : undefined,

        factoryId: values.factoryId ? Number(values.factoryId) : undefined,

        receivingPointId: values.receivingPointId
          ? Number(values.receivingPointId)
          : undefined,

        unitId: values.unitId ? Number(values.unitId) : undefined,

        organizationName: values.organizationName?.trim() || undefined,

        organizationId: values.organizationId
          ? Number(values.organizationId)
          : undefined,

        isActive: values.isActive,

        // IMPORTANT:
        // Organization user fixed type.
        userType: "organization" as const,
      };

      if (isEdit && user) {
        const payload: UpdateOrganizationUserPayload = {
          ...commonFields,

          ...(passwordValue
            ? {
                password: passwordValue,
                confirmPassword: values.confirmPassword?.trim(),
              }
            : {}),
        };

        const saved = await updateOrganizationUser(
          String(user.uuid ?? user.id),
          payload,
        );

        toast.success("Organization user updated successfully.");

        onSuccess(saved);
      } else {
        const payload: CreateOrganizationUserPayload = {
          ...commonFields,

          password: passwordValue ?? "",

          confirmPassword: values.confirmPassword?.trim() ?? "",
        };

        const saved = await createOrganizationUser(payload);

        toast.success("Organization user created successfully.");

        onSuccess(saved);
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to save organization user.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEdit ? "Edit Organization User" : "Create Organization User"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? "Update organization user information."
              : "Create a new organization user."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User Type */}
      <div
        className="rounded-xl border p-4"
        style={{
          borderColor: `${primaryColor}30`,
          backgroundColor: `${primaryColor}08`,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          User Type
        </p>

        <p className="mt-1 text-sm font-bold" style={{ color: primaryColor }}>
          Organization User
        </p>
      </div>

      {/* Basic Information */}
      <section>
        <SectionTitle title="Basic Information" />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" required error={errors.firstName?.message}>
            <input
              {...register("firstName")}
              placeholder="Enter name"
              className={inputClass(Boolean(errors.firstName))}
            />
          </Field>

          <Field label="Last Name" error={errors.lastName?.message}>
            <input
              {...register("lastName")}
              placeholder="Enter last name"
              className={inputClass(Boolean(errors.lastName))}
            />
          </Field>

          <Field label="Username" required error={errors.username?.message}>
            <input
              {...register("username")}
              placeholder="Enter username"
              className={inputClass(Boolean(errors.username))}
            />
          </Field>

          <Field label="Email" required error={errors.email?.message}>
            <input
              type="email"
              {...register("email")}
              placeholder="name@example.com"
              className={inputClass(Boolean(errors.email))}
            />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <input
              {...register("phone")}
              placeholder="+8801XXXXXXXXX"
              className={inputClass(Boolean(errors.phone))}
            />
          </Field>

          <Field label="Employee ID" error={errors.employeeId?.message}>
            <input
              {...register("employeeId")}
              placeholder="Employee ID"
              className={inputClass(Boolean(errors.employeeId))}
            />
          </Field>
        </div>
      </section>

      {/* Password */}
      <section>
        <SectionTitle title="Password" />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label={`Password${isEdit ? " (optional)" : ""}`}
            required={!isEdit}
            error={errors.password?.message}
          >
            <input
              type="password"
              {...register("password")}
              placeholder={
                isEdit
                  ? "Leave empty to keep current password"
                  : "Enter password"
              }
              className={inputClass(Boolean(errors.password))}
            />
          </Field>

          <Field
            label={`Confirm Password${password ? " *" : ""}`}
            error={errors.confirmPassword?.message}
          >
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm password"
              className={inputClass(Boolean(errors.confirmPassword))}
            />
          </Field>
        </div>
      </section>

      {/* Organization */}
      <section>
        <SectionTitle title="Organization Information" />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Organization Name"
            error={errors.organizationName?.message}
          >
            <input
              {...register("organizationName")}
              placeholder="Organization name"
              className={inputClass(Boolean(errors.organizationName))}
            />
          </Field>

          <Field label="Organization ID" error={errors.organizationId?.message}>
            <input
              {...register("organizationId")}
              placeholder="Organization ID"
              className={inputClass(Boolean(errors.organizationId))}
            />
          </Field>

          <Field label="Organization Logo">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <Upload className="h-4 w-4" />
              Upload Logo
            </button>
          </Field>

          {logoPreview && (
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-200">
                <img
                  src={logoPreview}
                  alt="Organization logo preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setLogoPreview(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="text-sm font-medium text-red-500 hover:text-red-600"
              >
                Remove Logo
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Additional Information */}
      <section>
        <SectionTitle title="Additional Information" />

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Designation ID">
            <input
              {...register("designationId")}
              placeholder="Designation ID"
              className={inputClass(Boolean(errors.designationId))}
            />
          </Field>

          <Field label="Distribution ID">
            <input
              {...register("distributionId")}
              placeholder="Distribution ID"
              className={inputClass(Boolean(errors.distributionId))}
            />
          </Field>

          <Field label="Warehouse ID">
            <input
              {...register("warehouseId")}
              placeholder="Warehouse ID"
              className={inputClass(Boolean(errors.warehouseId))}
            />
          </Field>

          <Field label="Factory ID">
            <input
              {...register("factoryId")}
              placeholder="Factory ID"
              className={inputClass(Boolean(errors.factoryId))}
            />
          </Field>

          <Field label="Receiving Point ID">
            <input
              {...register("receivingPointId")}
              placeholder="Receiving Point ID"
              className={inputClass(Boolean(errors.receivingPointId))}
            />
          </Field>

          <Field label="Unit ID">
            <input
              {...register("unitId")}
              placeholder="Unit ID"
              className={inputClass(Boolean(errors.unitId))}
            />
          </Field>
        </div>
      </section>

      {/* Status */}
      <section>
        <SectionTitle title="Status" />

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 rounded"
            style={{
              accentColor: primaryColor,
            }}
          />

          <span>
            <span className="block text-sm font-semibold text-slate-700">
              Active
            </span>

            <span className="block text-xs text-slate-400">
              Allow this organization user to access the platform.
            </span>
          </span>
        </label>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: primaryColor,
          }}
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}

          {isEdit ? "Update Organization User" : "Create Organization User"}
        </button>
      </div>
    </form>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="mb-4 text-sm font-bold text-slate-800">{title}</h3>;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
    hasError
      ? "border-red-300 focus:ring-4 focus:ring-red-100"
      : "border-slate-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
  }`;
}
