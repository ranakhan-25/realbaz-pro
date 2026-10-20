"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import {
  Building2,
  CalendarRange,
  Coins,
  CreditCard,
  Layers,
  Keyboard,
  UserCog,
  ShieldCheck,
  FileText,
  FileBarChart2,
  MessageSquare,
  Mail,
  Activity,
  SlidersHorizontal,
  Puzzle,
  BellRing,
  ScrollText,
  Save,
  Info,
} from "lucide-react";
import { FaFacebook } from "react-icons/fa";

const SETTINGS_MAP: Record<
  string,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    category: string;
    fields: { name: string; label: string; type: string; placeholder: string }[];
  }
> = {
  company: {
    label: "Company Settings",
    description: "Manage organizational profiles, legal entities, and contact info.",
    icon: Building2,
    category: "Core & Financial",
    fields: [
      { name: "companyName", label: "Company Legal Name", type: "text", placeholder: "Acme Corp Ltd." },
      { name: "taxId", label: "Tax Registration / EIN", type: "text", placeholder: "TAX-12345678" },
      { name: "address", label: "Headquarters Address", type: "text", placeholder: "123 Business Way, Suite 100" },
    ],
  },
  "financial-year": {
    label: "Financial Year Settings",
    description: "Configure active fiscal periods, accounting locks, and year-end dates.",
    icon: CalendarRange,
    category: "Core & Financial",
    fields: [
      { name: "startDate", label: "Fiscal Year Start Date", type: "date", placeholder: "" },
      { name: "endDate", label: "Fiscal Year End Date", type: "date", placeholder: "" },
    ],
  },
  currency: {
    label: "Currency Settings",
    description: "Setup base system currency and multi-currency conversion settings.",
    icon: Coins,
    category: "Core & Financial",
    fields: [
      { name: "baseCurrency", label: "Base Currency Code", type: "text", placeholder: "USD ($)" },
      { name: "format", label: "Number Format Pattern", type: "text", placeholder: "1,000.00" },
    ],
  },
  "installment-plan": {
    label: "Installment Plan Settings",
    description: "Define real estate booking payment schedules and auto-calculation rules.",
    icon: CreditCard,
    category: "Core & Financial",
    fields: [
      { name: "defaultTenure", label: "Default Tenure (Months)", type: "number", placeholder: "12" },
      { name: "interestRate", label: "Default Interest Rate (%)", type: "number", placeholder: "5.5" },
    ],
  },
  "approval-layer": {
    label: "Approval Layer Settings",
    description: "Design multi-level authorization chains for vouchers and requisitions.",
    icon: Layers,
    category: "Core & Financial",
    fields: [
      { name: "maxLevels", label: "Maximum Approval Levels", type: "number", placeholder: "3" },
      { name: "autoApproveLimit", label: "Auto-Approve Threshold ($)", type: "number", placeholder: "500" },
    ],
  },
  "user-management": {
    label: "User Management Settings",
    description: "Create employee accounts, manage departmental seats, and assign roles.",
    icon: UserCog,
    category: "Access & Security",
    fields: [
      { name: "maxUsers", label: "Maximum Active Users", type: "number", placeholder: "50" },
      { name: "defaultRole", label: "Default Role for New Users", type: "text", placeholder: "Standard Staff" },
    ],
  },
  "user-role": {
    label: "User Role Permissions",
    description: "Set module-level permission matrices and access controls.",
    icon: ShieldCheck,
    category: "Access & Security",
    fields: [
      { name: "roleName", label: "Custom Role Designation", type: "text", placeholder: "Senior Manager" },
    ],
  },
  "user-activity": {
    label: "User Activity Logs",
    description: "Audit system logs, IP tracking, session timeouts, and critical actions.",
    icon: Activity,
    category: "Access & Security",
    fields: [
      { name: "retentionDays", label: "Audit Log Retention (Days)", type: "number", placeholder: "90" },
      { name: "sessionTimeout", label: "Inactivity Timeout (Minutes)", type: "number", placeholder: "30" },
    ],
  },
  invoice: {
    label: "Invoice Settings",
    description: "Customize invoice prefixes, tax rules, terms, and auto-numbering.",
    icon: FileText,
    category: "Core & Financial",
    fields: [
      { name: "prefix", label: "Invoice Number Prefix", type: "text", placeholder: "INV-" },
      { name: "terms", label: "Default Payment Terms", type: "text", placeholder: "Net 30 Days" },
    ],
  },
  report: {
    label: "Report Settings",
    description: "Configure PDF headers, page layouts, print margins, and watermarks.",
    icon: FileBarChart2,
    category: "System & Add-ons",
    fields: [
      { name: "footerNote", label: "Default Report Footer Note", type: "text", placeholder: "Confidential - Internal Use Only" },
    ],
  },
  sms: {
    label: "SMS Gateway Settings",
    description: "Integrate SMS gateways, delivery webhooks, and default alert templates.",
    icon: MessageSquare,
    category: "Messages & Email",
    fields: [
      { name: "provider", label: "SMS Gateway Provider", type: "text", placeholder: "Twilio / SMS API" },
      { name: "senderId", label: "Default Sender ID", type: "text", placeholder: "REALBIZ" },
    ],
  },
  email: {
    label: "Email & SMTP Settings",
    description: "Configure SMTP/IMAP servers, sender identity, and transactional templates.",
    icon: Mail,
    category: "Messages & Email",
    fields: [
      { name: "smtpHost", label: "SMTP Host", type: "text", placeholder: "smtp.mailgun.org" },
      { name: "fromEmail", label: "Default Sender Email", type: "email", placeholder: "noreply@company.com" },
    ],
  },
  "bulk-push-notification": {
    label: "Bulk Push Notification Settings",
    description: "Broadcast instant web notifications to team members or user segments.",
    icon: BellRing,
    category: "Messages & Email",
    fields: [
      { name: "fcmKey", label: "Firebase / Push API Key", type: "text", placeholder: "AIzaSy..." },
    ],
  },
  "facebook-api": {
    label: "Facebook API Settings",
    description: "Connect Meta Business account to auto-sync Facebook lead forms.",
    icon: FaFacebook,
    category: "Messages & Email",
    fields: [
      { name: "appId", label: "Facebook App ID", type: "text", placeholder: "1234567890" },
      { name: "accessToken", label: "Page Access Token", type: "password", placeholder: "EAA..." },
    ],
  },
  "keyboard-shortcut": {
    label: "Keyboard Shortcut Configuration",
    description: "Customize global quick keys to speed up navigation and entry tasks.",
    icon: Keyboard,
    category: "System & Add-ons",
    fields: [
      { name: "quickSearchKey", label: "Global Search Key", type: "text", placeholder: "Ctrl + K" },
    ],
  },
  "company-setting": {
    label: "System Preference Settings",
    description: "Tweak default system behaviors, localizations, and feature toggles.",
    icon: SlidersHorizontal,
    category: "System & Add-ons",
    fields: [
      { name: "timezone", label: "Default Timezone", type: "text", placeholder: "UTC+06:00" },
      { name: "language", label: "Primary System Language", type: "text", placeholder: "English (US)" },
    ],
  },
  "add-ons": {
    label: "Add-ons & Integrations",
    description: "Enable or disable third-party plugins, custom scripts, and extensions.",
    icon: Puzzle,
    category: "System & Add-ons",
    fields: [
      { name: "webhooks", label: "Custom Webhook URL", type: "text", placeholder: "https://api.example.com/webhook" },
    ],
  },
  "cheque-template": {
    label: "Cheque Print Templates",
    description: "Design bank cheque print layouts, coordinate alignments, and previews.",
    icon: ScrollText,
    category: "Core & Financial",
    fields: [
      { name: "templateName", label: "Active Bank Template", type: "text", placeholder: "Standard Commercial Bank Layout" },
    ],
  },
};

export default function SettingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const setting = SETTINGS_MAP[slug];

  if (!setting) {
    notFound();
  }

  const Icon = setting.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header Card */}
      <div className="flex items-start gap-4 p-6 rounded-xl border border-border bg-surface shadow-xs">
        <div className="h-12 w-12 rounded-xl bg-accent-soft text-accent-strong flex items-center justify-center shrink-0">
          <Icon size={24} />
        </div>
        <div className="space-y-1">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-canvas text-ink-muted border border-border uppercase tracking-wider">
            {setting.category}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-ink">{setting.label}</h1>
          <p className="text-xs sm:text-sm text-ink-muted">{setting.description}</p>
        </div>
      </div>

      {/* Dynamic Form Area */}
      <div className="p-6 rounded-xl border border-border bg-surface space-y-6 shadow-xs">
        <h2 className="text-sm font-semibold text-ink border-b border-border pb-3">
          Configuration Settings
        </h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {setting.fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="block text-xs font-medium text-ink">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full h-10 px-3 text-xs sm:text-sm rounded-lg border border-border bg-canvas text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-accent-strong/30 transition-all"
              />
            </div>
          ))}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-medium bg-accent-strong text-white flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              <Save size={14} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}