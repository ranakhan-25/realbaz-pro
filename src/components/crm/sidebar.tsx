"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  SlidersHorizontal,
  UserRound,
  PhoneCall,
  CarFront,
  Building2,
  FileBarChart2,
  Gauge,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

interface NavNode {
  id: string;
  label: string;
  href?: string;
  icon?: React.ElementType;
  children?: NavNode[];
}

const NAV_TREE: NavNode[] = [
  {
    id: "crm",
    label: "CRM",
    icon: LayoutDashboard,
    children: [
      {
        id: "configuration",
        label: "Configuration",
        icon: SlidersHorizontal,
        children: [
          {
            id: "communication_status",
            label: "Communication Status",
            href: "/crm-module/communication_status",
          },
          { id: "teams", label: "Teams", href: "/crm-module/teams" },
          {
            id: "lead_category",
            label: "Lead Category",
            href: "/crm-module/lead_category",
          },
          { id: "campaign", label: "Campaign", href: "/crm-module/campaign" },
          {
            id: "profession",
            label: "Profession",
            href: "/crm-module/profession",
          },
          {
            id: "lead_source",
            label: "Lead Source",
            href: "/crm-module/add-lead-source",
          },
          { id: "offers", label: "Offers", href: "/crm-module/feature" },
          { id: "area", label: "Area", href: "/crm-module/area" },
          {
            id: "lead_stage",
            label: "Lead Stage",
            href: "/crm-module/lead_status",
          },
          { id: "project", label: "Project", href: "/project-module/projects" },
          {
            id: "price_range",
            label: "Price Range",
            href: "/crm-module/price-range",
          },
          {
            id: "requirement_type",
            label: "Requirement Type",
            href: "/crm-module/requirement-type",
          },
          {
            id: "visit_places",
            label: "Visit Places",
            href: "/crm-module/visit_places",
          },
          {
            id: "visit_status",
            label: "Visit Status",
            href: "/crm-module/visit_status",
          },
          {
            id: "task_type",
            label: "Task Type",
            href: "/crm-module/task_type",
          },
          {
            id: "internal_task",
            label: "Internal Task",
            href: "/crm-module/internal-tasks",
          },
        ],
      },
      {
        id: "lead",
        label: "Lead",
        icon: UserRound,
        children: [
          {
            id: "lead_account",
            label: "Lead",
            href: "/crm-module/add-lead-account",
          },
          {
            id: "junk_lead",
            label: "Junk Lead",
            href: "/crm-module/junk-add-lead-account",
          },
          {
            id: "transfer_history",
            label: "Transfer History",
            href: "/crm-module/transfer-call-list",
          },
        ],
      },
      {
        id: "call_center",
        label: "Call Center",
        icon: PhoneCall,
        children: [
          {
            id: "follow_up",
            label: "Follow Up",
            href: "/crm-module/reminder-call-list",
          },
          {
            id: "call_report",
            label: "Call Report",
            href: "/crm-module/call-report",
          },
          {
            id: "call_details_report",
            label: "Call Details Report",
            href: "/crm-module/call-details-report",
          },
          {
            id: "call_assign_history",
            label: "Call Assign History",
            href: "/crm-module/call-assign-history",
          },
        ],
      },
      {
        id: "task_visit",
        label: "Task / Visit",
        icon: CarFront,
        children: [
          {
            id: "reminder_task",
            label: "Task/Visit",
            href: "/crm-module/reminder-task-list",
          },
          {
            id: "deal_negotiation",
            label: "Deal Negotiation Activity",
            href: "/crm-module/deal-negotiation-activity-list",
          },
          {
            id: "visit_task_report",
            label: "Task/Visit Summary Report",
            href: "/crm-module/visit-task-report",
          },
          {
            id: "visit_details_report",
            label: "Task/Visit Details Report",
            href: "/crm-module/visit-details-report",
          },
        ],
      },
      {
        id: "property",
        label: "Property",
        icon: Building2,
        children: [
          { id: "flat", label: "Flat", href: "/inventory-module/flat" },
          {
            id: "land_group",
            label: "Land",
            children: [
              { id: "road", label: "Road", href: "/project-module/road" },
              { id: "block", label: "Block", href: "/project-module/block" },
              { id: "land", label: "Land", href: "/inventory-module/land" },
            ],
          },
          {
            id: "booking",
            label: "Booking",
            href: "/billing/flat_land_booking_list",
          },
          {
            id: "sale_offer",
            label: "Sale Offer",
            href: "/billing/flat_land_sale_offer_list",
          },
        ],
      },
      {
        id: "reports",
        label: "Reports",
        icon: FileBarChart2,
        children: [
          {
            id: "user_wise_report",
            label: "User Wise Report",
            href: "/crm-module/user-wise-call-task-report",
          },
          {
            id: "user_activity_report",
            label: "User Activity Report",
            href: "/crm-module/user-wise-activity-report",
          },
          {
            id: "sales_pipeline",
            label: "Sales Pipeline Funnel Report",
            href: "/crm-module/sales-pipeline-funnel-report",
          },
          {
            id: "team_reports",
            label: "Team Reports",
            href: "/crm-module/team-wise-lead-report",
          },
          {
            id: "interested_flat_land",
            label: "Interested Flat/Land",
            href: "/crm-module/flat-land-interest-list",
          },
          {
            id: "requirements",
            label: "Requirements",
            href: "/crm-module/see-requirements",
          },
          {
            id: "sales_probability",
            label: "Sales Probability",
            href: "/crm-module/sales-probability",
          },
          {
            id: "flat_land_sale_report",
            label: "Flat/Land Sale Report",
            href: "/billing/flat_land_sale_report",
          },
          {
            id: "missed_followup",
            label: "Missed FollowUp/Visit Summary",
            href: "/crm-module/missed-followup-list-report",
          },
          {
            id: "deal_negotiation_report",
            label: "Deal Negotiation Report",
            href: "/crm-module/deal-negotiation-report",
          },
          {
            id: "call_log_report",
            label: "Call Log Report",
            href: "/crm-module/call-log-report",
          },
          {
            id: "call_log_details",
            label: "Call Log Details Report",
            href: "/crm-module/call-log-details-report",
          },
        ],
      },
      {
        id: "kpi",
        label: "KPI",
        icon: Gauge,
        children: [
          {
            id: "kpi_settings",
            label: "Employee KPI Setting",
            href: "/hrm-module/employee_wise_kpi_settings",
          },
          {
            id: "kpi_reports",
            label: "Reports",
            children: [
              {
                id: "employee_call_report",
                label: "Employee Call Report",
                href: "/hrm-module/employee_wise_call_report",
              },
              {
                id: "team_call_report",
                label: "Team Call Report",
                href: "/hrm-module/team_wise_task_report",
              },
            ],
          },
        ],
      },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openNodes, setOpenNodes] = useState<Record<string, boolean>>({
    crm: true,
    configuration: false,
  });
  const pathname = usePathname();

  const toggleNode = (id: string) => {
    if (collapsed) setCollapsed(false);
    setOpenNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (nodes: NavNode[], depth = 0) => {
    return nodes.map((node) => {
      const Icon = node.icon;
      const hasChildren = node.children && node.children.length > 0;
      const isOpen = openNodes[node.id];
      const isActive = node.href ? pathname === node.href : false;

      return (
        <div key={node.id} className="space-y-0.5">
          {hasChildren ? (
            <button
              onClick={() => toggleNode(node.id)}
              className={clsx(
                "group relative w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-150",
                depth === 0
                  ? "font-semibold text-ink"
                  : "text-ink-muted hover:text-ink hover:bg-canvas",
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {Icon && <Icon size={16} strokeWidth={2} className="shrink-0 text-accent-strong" />}
                {!collapsed && <span className="truncate">{node.label}</span>}
              </div>

              {!collapsed && (
                <ChevronDown
                  size={14}
                  className={clsx(
                    "shrink-0 text-ink-faint transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              )}
            </button>
          ) : (
            <Link
              href={node.href || "#"}
              className={clsx(
                "group relative w-full flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150",
                isActive
                  ? "text-accent-strong font-semibold bg-accent-soft"
                  : "text-ink-muted hover:text-ink hover:bg-canvas",
              )}
            >
              {Icon && <Icon size={15} strokeWidth={2} className="shrink-0" />}
              {!collapsed && <span className="truncate">{node.label}</span>}
            </Link>
          )}

          {/* Recursive Nested Sub-tree */}
          {!collapsed && hasChildren && (
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className={clsx(
                    "overflow-hidden space-y-0.5 border-l border-border/60 ml-3.5 pl-2.5",
                  )}
                >
                  {renderTree(node.children!, depth + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 250 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex h-screen sticky top-0 flex-col border-r border-border bg-surface select-none"
    >
      {/* Header */}
      <div className="flex items-center px-4 h-16 border-b border-border shrink-0">
        {collapsed ? (
          <div className="h-8 w-8 shrink-0 rounded-md bg-accent-soft flex items-center justify-center mx-auto">
            <Building2 size={17} className="text-accent-strong" strokeWidth={2} />
          </div>
        ) : (
          <div className="h-8 w-auto max-w-full flex items-center overflow-hidden">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">{renderTree(NAV_TREE)}</nav>

      {/* Collapse Footer Toggle */}
      <div className="p-2 border-t border-border shrink-0">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-ink-faint hover:text-ink-muted hover:bg-canvas transition-colors text-[13px]"
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </motion.aside>
  );
}
