import React, { useState, useRef } from "react";
import type { MenuProps } from "antd";
import { Tooltip } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { getAntIcon } from "./getAntIcon";
import Link from "next/link";

interface SmartTooltipProps {
  title: string;
  children: React.ReactNode;
}

const SmartTooltip: React.FC<SmartTooltipProps> = ({ title, children }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const checkTruncation = () => {
    if (ref.current) {
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      const rangeWidth = range.getBoundingClientRect().width;
      const clientWidth = ref.current.clientWidth;
      const parentWidth = ref.current.parentElement?.clientWidth || clientWidth;
      const effectiveWidth = Math.min(clientWidth, parentWidth);

      return (
        rangeWidth - effectiveWidth > 1 ||
        ref.current.scrollWidth - clientWidth > 1
      );
    }
    return false;
  };

  const handleMouseEnter = () => {
    if (checkTruncation()) {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  return (
    <Tooltip title={title} open={visible} placement="right">
      <span
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "inline-block",
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          verticalAlign: "middle",
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export interface PermittedMenu {
  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  menuTree: MenuTreeItem[];
}

export interface MenuTreeItem {
  id: string;
  title: string;
  url: string;
  target: string;
  location: string[];
  icon: string;
  order: number;
  elementClass: string | null;
  elementId: string | null;
  description: string | null;
  parentId: string | null;
  moduleId: string;
  children: MenuTreeItem[];
  permissions: { id: string; key: string; description: string }[];
}

export function menuDataToItems(
  menuObj: any,
  role: string = "admin",
  collapsed: boolean = false,
): MenuProps["items"] {
  return Object.entries(menuObj)
    .map(([key, item], index) => {
      const t = item as {
        label: string;
        icon?: string;
        roles?: string[];
        subMenu?: Record<string, unknown>;
        route?: string;
        action?: string;
        shortcut?: string;
        isDone?: boolean;
      };

      // Skip items that don't match the role
      if (t.roles && !t.roles.includes(role)) return null;

      const hasChildren = !!t.subMenu;
      const children =
        hasChildren && t.subMenu ? menuDataToItems(t.subMenu, role, collapsed) : [];

      // Create menu item
      const menuItem: any = {
        key: t.route && t.route !== "#" ? t.route : t.action || key,
        route: t.route,
        icon: getAntIcon(t.icon),
        label: t.isDone ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {collapsed ? (
              <span>{t.label}</span>
            ) : (
              <SmartTooltip title={t.label}>
                <span>{t.label}</span>
              </SmartTooltip>
            )}
            <CheckCircleFilled
              style={{ color: "#52c41a", marginLeft: "8px" }}
            />
          </div>
        ) : collapsed ? (
          <span>{t.label}</span>
        ) : (
          <SmartTooltip title={t.label}>
            <span>{t.label}</span>
          </SmartTooltip>
        ),
        isDone: t.isDone,
      };

      // Add children if they exist
      if (hasChildren && t.subMenu) {
        if (children && children.length > 0) {
          menuItem.children = children;
        }
      }

      // Add shortcut if available
      if (t.shortcut) {
        menuItem.label = (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {collapsed ? (
              <span>{t.label}</span>
            ) : (
              <SmartTooltip title={t.label}>
                <span>{t.label}</span>
              </SmartTooltip>
            )}
          </div>
        );
      }

      return menuItem;
    })
    .filter(Boolean);
}

export function menuTreeToAntdItems(
  menuTree: any[],
  isVisibleFilter: any,
  role: string = "admin",
  collapsed: boolean = false,
): MenuProps["items"] {
  return menuTree
    .map((item) => {
      // Filter by role if needed
      if (item.roles && !item.roles.includes(role)) return null;

      // Filter by visibility
      if (item.isVisible === false && isVisibleFilter) return null;

      const hasChildren = item.children && item.children.length > 0;
      const children = hasChildren
        ? menuTreeToAntdItems(item.children, isVisibleFilter, role, collapsed)
        : [];

      const menuItem: any = {
        key: item.url && item.url !== "#" ? item.url : item.id,
        label: item.title ? (
          // Check if URL is valid before rendering Link
          item.url && item.url !== "#" ? (
            collapsed ? (
              <Link href={item.url}>{item.title}</Link>
            ) : (
              <SmartTooltip title={item.title}>
                <Link href={item.url}>{item.title}</Link>
              </SmartTooltip>
            )
          ) : collapsed ? (
            <span>{item.title}</span>
          ) : (
            <SmartTooltip title={item.title}>
              <span>{item.title}</span>
            </SmartTooltip>
          )
        ) : undefined,
        icon: item.icon ? (
          <div
            dangerouslySetInnerHTML={{ __html: item.icon }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              verticalAlign: "middle",
            }}
            className="menu-icon"
          />
        ) : undefined,
      };

      if (hasChildren) {
        menuItem.children = children;
      }

      return menuItem;
    })
    .filter(Boolean);
}
