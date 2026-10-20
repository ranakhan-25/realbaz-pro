"use client";

import type { Role } from "@/services/roleService";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShieldCheck, X } from "lucide-react";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   GENERIC MODAL
========================================================= */

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  labelledBy?: string;
  maxWidthClass?: string;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  children,
  onClose,
  labelledBy,
  maxWidthClass = "max-w-[1180px]",
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="
          fixed inset-0 z-[100]
          flex items-center justify-center
          bg-slate-950/55
          p-4
          backdrop-blur-[2px]
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (closeOnOverlayClick && event.target === event.currentTarget) {
            onClose();
          }
        }}
        aria-labelledby={labelledBy}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.18 }}
          className={`
            flex
            max-h-[94vh]
            w-full
            ${maxWidthClass}
            flex-col
            overflow-hidden
            rounded-xl
            bg-white
            shadow-2xl
          `}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================================
   TYPES
========================================================= */

export interface PermissionItem {
  id: number | string;
  name: string;
  code?: string;
}

export interface FeatureItem {
  id: number | string;
  name: string;
  code?: string;
  permissions: PermissionItem[];
}

export interface RolePermissionRole {
  id: number | string;
  name: string;
  code?: string;
  features: FeatureItem[];
}

export interface RolePermissionData {
  roles: RolePermissionRole[];
}

export interface RolePermissionSavePayload {
  roleId: number | string;
  roleName: string;
  permissionIds: Array<number | string>;
  featureIds: Array<number | string>;
}

export interface RolePermissionModalProps {
  open: boolean;
  onClose: () => void;
  loadData?: () => Promise<RolePermissionData>;
  initialRoleId?: number | string;
  initialPermissionIds?: Array<number | string>;
  role?: Role | null;
  onSave?: (payload: RolePermissionSavePayload) => void | Promise<void>;
  title?: string;
}

/* =========================================================
   DEMO DATA
========================================================= */

const DEMO_DATA: RolePermissionData = {
  roles: [
    {
      id: 1,
      name: "HRMS",
      code: "HRMS",
      features: [
        {
          id: 101,
          name: "Employee Management",
          code: "EMPLOYEE_MANAGEMENT",
          permissions: [
            {
              id: 1001,
              name: "View Employees",
              code: "VIEW_EMPLOYEES",
            },
            {
              id: 1002,
              name: "Create Employee",
              code: "CREATE_EMPLOYEE",
            },
            {
              id: 1003,
              name: "Edit Employee",
              code: "EDIT_EMPLOYEE",
            },
            {
              id: 1004,
              name: "Delete Employee",
              code: "DELETE_EMPLOYEE",
            },
          ],
        },
        {
          id: 102,
          name: "Attendance",
          code: "ATTENDANCE",
          permissions: [
            {
              id: 1005,
              name: "View Attendance",
              code: "VIEW_ATTENDANCE",
            },
            {
              id: 1006,
              name: "Manage Attendance",
              code: "MANAGE_ATTENDANCE",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "POS",
      code: "POS",
      features: [
        {
          id: 201,
          name: "Sales",
          code: "SALES",
          permissions: [
            {
              id: 2001,
              name: "View Sales",
              code: "VIEW_SALES",
            },
            {
              id: 2002,
              name: "Create Sale",
              code: "CREATE_SALE",
            },
            {
              id: 2003,
              name: "Edit Sale",
              code: "EDIT_SALE",
            },
            {
              id: 2004,
              name: "Delete Sale",
              code: "DELETE_SALE",
            },
          ],
        },
        {
          id: 202,
          name: "Products",
          code: "PRODUCTS",
          permissions: [
            {
              id: 2005,
              name: "View Products",
              code: "VIEW_PRODUCTS",
            },
            {
              id: 2006,
              name: "Manage Products",
              code: "MANAGE_PRODUCTS",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Production",
      code: "PRODUCTION",
      features: [
        {
          id: 301,
          name: "Production Management",
          code: "PRODUCTION_MANAGEMENT",
          permissions: [
            {
              id: 3001,
              name: "View Production",
              code: "VIEW_PRODUCTION",
            },
            {
              id: 3002,
              name: "Create Production",
              code: "CREATE_PRODUCTION",
            },
            {
              id: 3003,
              name: "Edit Production",
              code: "EDIT_PRODUCTION",
            },
            {
              id: 3004,
              name: "Delete Production",
              code: "DELETE_PRODUCTION",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "System",
      code: "SYSTEM",
      features: [
        {
          id: 401,
          name: "User Management",
          code: "USER_MANAGEMENT",
          permissions: [
            {
              id: 4001,
              name: "View Users",
              code: "VIEW_USERS",
            },
            {
              id: 4002,
              name: "Create User",
              code: "CREATE_USER",
            },
            {
              id: 4003,
              name: "Edit User",
              code: "EDIT_USER",
            },
            {
              id: 4004,
              name: "Delete User",
              code: "DELETE_USER",
            },
          ],
        },
        {
          id: 402,
          name: "Role Management",
          code: "ROLE_MANAGEMENT",
          permissions: [
            {
              id: 4005,
              name: "View Roles",
              code: "VIEW_ROLES",
            },
            {
              id: 4006,
              name: "Create Role",
              code: "CREATE_ROLE",
            },
            {
              id: 4007,
              name: "Edit Role",
              code: "EDIT_ROLE",
            },
            {
              id: 4008,
              name: "Delete Role",
              code: "DELETE_ROLE",
            },
          ],
        },
      ],
    },
    {
      id: 5,
      name: "Accounts",
      code: "ACCOUNTS",
      features: [
        {
          id: 501,
          name: "Accounting",
          code: "ACCOUNTING",
          permissions: [
            {
              id: 5001,
              name: "View Accounts",
              code: "VIEW_ACCOUNTS",
            },
            {
              id: 5002,
              name: "Create Transaction",
              code: "CREATE_TRANSACTION",
            },
            {
              id: 5003,
              name: "Edit Transaction",
              code: "EDIT_TRANSACTION",
            },
            {
              id: 5004,
              name: "Delete Transaction",
              code: "DELETE_TRANSACTION",
            },
          ],
        },
        {
          id: 502,
          name: "Reports",
          code: "REPORTS",
          permissions: [
            {
              id: 5005,
              name: "View Reports",
              code: "VIEW_REPORTS",
            },
            {
              id: 5006,
              name: "Export Reports",
              code: "EXPORT_REPORTS",
            },
          ],
        },
      ],
    },
  ],
};

/* =========================================================
   CHECKBOX
========================================================= */

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
}

function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: CheckboxProps) {
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      checked={checked}
      aria-label={ariaLabel}
      onChange={(event) => {
        event.stopPropagation();
        onChange();
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
      className="
        h-3.5
        w-3.5
        shrink-0
        cursor-pointer
        accent-[#009432]
      "
    />
  );
}

/* =========================================================
   ROLE PERMISSION MODAL
========================================================= */

export default function RolePermissionModal({
  open,
  onClose,
  loadData,
  initialRoleId,
  initialPermissionIds = [],
  role,
  onSave,
  title = "Role Permissions",
}: RolePermissionModalProps) {
  const [data, setData] = useState<RolePermissionData | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const [activeRoleId, setActiveRoleId] = useState<number | string | null>(
    null,
  );

  /*
   * IMPORTANT:
   *
   * Every role has a completely separate permission selection.
   *
   * Example:
   *
   * {
   *   "1": ["1001", "1003"],
   *   "2": ["2001", "2004"],
   *   "3": ["3002"]
   * }
   *
   * Selecting HRMS permission does NOT affect POS.
   */
  const [selectedByRole, setSelectedByRole] = useState<
    Record<string, string[]>
  >({});

  /*
   * Role names are also stored separately.
   */
  const [roleNames, setRoleNames] = useState<Record<string, string>>({});

  const [roleName, setRoleName] = useState("");
  const [search, setSearch] = useState("");

  /*
   * Prevent repeated initialization.
   */
  const initializedRef = useRef(false);

  /*
   * Keep the latest values available to the open effect
   * without putting unstable objects/functions into the
   * dependency array.
   */
  const loadDataRef = useRef(loadData);
  const initialRoleIdRef = useRef(initialRoleId);
  const initialPermissionIdsRef = useRef(initialPermissionIds);
  const roleRef = useRef(role);

  useEffect(() => {
    loadDataRef.current = loadData;
  }, [loadData]);

  useEffect(() => {
    initialRoleIdRef.current = initialRoleId;
  }, [initialRoleId]);

  useEffect(() => {
    initialPermissionIdsRef.current = initialPermissionIds;
  }, [initialPermissionIds]);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    if (!open) {
      initializedRef.current = false;
      return;
    }

    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    let cancelled = false;

    const initialize = async () => {
      setLoading(true);
      setUsingDemoData(false);

      try {
        let result: RolePermissionData | null = null;

        const currentLoadData = loadDataRef.current;

        if (currentLoadData) {
          try {
            result = await currentLoadData();
          } catch {
            result = null;
          }
        }

        /*
         * If API is unavailable or returns empty data,
         * use demo data.
         */
        if (
          !result ||
          !Array.isArray(result.roles) ||
          result.roles.length === 0
        ) {
          result = DEMO_DATA;
          setUsingDemoData(true);
        }

        if (cancelled) {
          return;
        }

        setData(result);

        /*
         * Build role names.
         */
        const names: Record<string, string> = {};

        result.roles.forEach((item) => {
          names[String(item.id)] = item.name;
        });

        /*
         * If parent passed an actual Role, make sure it is
         * also available as the active role name.
         */
        const currentRole = roleRef.current;

        if (currentRole) {
          names[String(currentRole.id)] = currentRole.name;
        }

        setRoleNames(names);

        /*
         * Determine initial role.
         */
        const requestedRoleId = initialRoleIdRef.current ?? currentRole?.id;

        const requestedRole = requestedRoleId
          ? result.roles.find(
              (item) => String(item.id) === String(requestedRoleId),
            )
          : undefined;

        const selectedRole = requestedRole ?? result.roles[0];

        if (!selectedRole) {
          setActiveRoleId(null);
          setRoleName("");
          setSelectedByRole({});
          return;
        }

        const selectedRoleKey = String(selectedRole.id);

        setActiveRoleId(selectedRole.id);

        setRoleName(
          currentRole && String(currentRole.id) === selectedRoleKey
            ? currentRole.name
            : selectedRole.name,
        );

        /*
         * IMPORTANT:
         *
         * Initial permissions are assigned ONLY to the
         * selected role.
         *
         * They will NOT be copied to other roles.
         */
        const initialIds = initialPermissionIdsRef.current.map(String);

        /*
         * If the selected Role already contains permissions,
         * use those permissions when no explicit initial
         * permission list was supplied.
         */
        let rolePermissionIds = initialIds;

        if (
          rolePermissionIds.length === 0 &&
          currentRole &&
          String(currentRole.id) === selectedRoleKey &&
          Array.isArray(currentRole.permissions)
        ) {
          rolePermissionIds = currentRole.permissions.map((permission) =>
            String(permission.id),
          );
        }

        setSelectedByRole({
          [selectedRoleKey]: rolePermissionIds,
        });

        setSearch("");
      } catch {
        if (cancelled) {
          return;
        }

        const fallback = DEMO_DATA;

        setData(fallback);
        setUsingDemoData(true);

        const firstRole = fallback.roles[0];

        if (firstRole) {
          const currentRole = roleRef.current;

          setActiveRoleId(firstRole.id);

          setRoleName(
            currentRole && String(currentRole.id) === String(firstRole.id)
              ? currentRole.name
              : firstRole.name,
          );

          setRoleNames(
            Object.fromEntries(
              fallback.roles.map((item) => [String(item.id), item.name]),
            ),
          );

          setSelectedByRole({
            [String(firstRole.id)]: initialPermissionIdsRef.current.map(String),
          });
        }

        setSearch("");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [open]);

  /* =======================================================
     ACTIVE ROLE
  ======================================================= */

  const activeRole = useMemo(() => {
    if (!data || activeRoleId === null) {
      return null;
    }

    return (
      data.roles.find((item) => String(item.id) === String(activeRoleId)) ??
      null
    );
  }, [data, activeRoleId]);

  /* =======================================================
     CURRENT ROLE PERMISSIONS
  ======================================================= */

  const selectedPermissionIds = useMemo(() => {
    if (activeRoleId === null || activeRoleId === undefined) {
      return new Set<string>();
    }

    return new Set(selectedByRole[String(activeRoleId)] ?? []);
  }, [selectedByRole, activeRoleId]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const visibleFeatures = useMemo(() => {
    if (!activeRole) {
      return [];
    }

    const query = search.trim().toLowerCase();

    if (!query) {
      return activeRole.features;
    }

    return activeRole.features
      .map((feature) => {
        const featureMatches =
          feature.name.toLowerCase().includes(query) ||
          feature.code?.toLowerCase().includes(query);

        /*
         * If feature itself matches, show all its
         * permissions.
         */
        if (featureMatches) {
          return feature;
        }

        /*
         * Otherwise show only matching permissions.
         */
        const matchingPermissions = feature.permissions.filter(
          (permission) =>
            permission.name.toLowerCase().includes(query) ||
            permission.code?.toLowerCase().includes(query),
        );

        if (matchingPermissions.length === 0) {
          return null;
        }

        return {
          ...feature,
          permissions: matchingPermissions,
        };
      })
      .filter((feature): feature is FeatureItem => feature !== null);
  }, [activeRole, search]);

  /* =======================================================
     ALL ACTIVE ROLE PERMISSIONS
  ======================================================= */

  const allActivePermissionIds = useMemo(() => {
    if (!activeRole) {
      return [];
    }

    return activeRole.features.flatMap((feature) =>
      feature.permissions.map((permission) => String(permission.id)),
    );
  }, [activeRole]);

  const allActiveSelected =
    allActivePermissionIds.length > 0 &&
    allActivePermissionIds.every((id) => selectedPermissionIds.has(id));

  const someActiveSelected = allActivePermissionIds.some((id) =>
    selectedPermissionIds.has(id),
  );

  /* =======================================================
     UPDATE CURRENT ROLE PERMISSIONS
  ======================================================= */

  const updateCurrentRolePermissions = useCallback(
    (updater: (current: Set<string>) => Set<string>) => {
      if (activeRoleId === null || activeRoleId === undefined) {
        return;
      }

      const roleKey = String(activeRoleId);

      setSelectedByRole((previous) => {
        const current = new Set(previous[roleKey] ?? []);

        const next = updater(current);

        return {
          ...previous,
          [roleKey]: Array.from(next),
        };
      });
    },
    [activeRoleId],
  );

  /* =======================================================
     TOGGLE INDIVIDUAL PERMISSION
  ======================================================= */

  const togglePermission = useCallback(
    (permissionId: number | string) => {
      const permissionKey = String(permissionId);

      updateCurrentRolePermissions((current) => {
        /*
         * If selected -> remove only this permission.
         *
         * If not selected -> add only this permission.
         *
         * Other permissions remain untouched.
         */
        if (current.has(permissionKey)) {
          current.delete(permissionKey);
        } else {
          current.add(permissionKey);
        }

        return current;
      });
    },
    [updateCurrentRolePermissions],
  );

  /* =======================================================
     TOGGLE FEATURE
  ======================================================= */

  const toggleFeature = useCallback(
    (feature: FeatureItem) => {
      const featurePermissionIds = feature.permissions.map((permission) =>
        String(permission.id),
      );

      updateCurrentRolePermissions((current) => {
        const allSelected =
          featurePermissionIds.length > 0 &&
          featurePermissionIds.every((id) => current.has(id));

        if (allSelected) {
          /*
           * Remove all permissions under this feature.
           */
          featurePermissionIds.forEach((id) => {
            current.delete(id);
          });
        } else {
          /*
           * Add all permissions under this feature.
           */
          featurePermissionIds.forEach((id) => {
            current.add(id);
          });
        }

        return current;
      });
    },
    [updateCurrentRolePermissions],
  );

  /* =======================================================
     TOGGLE ALL PERMISSIONS FOR ACTIVE ROLE
  ======================================================= */

  const toggleAll = useCallback(() => {
    if (!activeRole) {
      return;
    }

    updateCurrentRolePermissions((current) => {
      const allSelected =
        allActivePermissionIds.length > 0 &&
        allActivePermissionIds.every((id) => current.has(id));

      if (allSelected) {
        /*
         * Remove every permission from current role only.
         */
        allActivePermissionIds.forEach((id) => {
          current.delete(id);
        });
      } else {
        /*
         * Add every permission to current role only.
         */
        allActivePermissionIds.forEach((id) => {
          current.add(id);
        });
      }

      return current;
    });
  }, [activeRole, allActivePermissionIds, updateCurrentRolePermissions]);

  /* =======================================================
     ROLE CHANGE
  ======================================================= */

  const handleRoleChange = useCallback(
    (roleId: number | string) => {
      const key = String(roleId);

      setActiveRoleId(roleId);
      setSearch("");

      /*
       * Every role keeps its own permission selection.
       *
       * We DO NOT reset selectedByRole here.
       */
      setRoleName(
        roleNames[key] ??
          data?.roles.find((item) => String(item.id) === key)?.name ??
          "",
      );
    },
    [data, roleNames],
  );

  /* =======================================================
     ROLE NAME CHANGE
  ======================================================= */

  const handleRoleNameChange = useCallback(
    (value: string) => {
      setRoleName(value);

      if (activeRoleId === null || activeRoleId === undefined) {
        return;
      }

      const roleKey = String(activeRoleId);

      /*
       * Keep role name separate for every role.
       */
      setRoleNames((previous) => ({
        ...previous,
        [roleKey]: value,
      }));
    },
    [activeRoleId],
  );

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = useCallback(async () => {
    if (activeRoleId === null || activeRoleId === undefined) {
      return;
    }

    const trimmedRoleName = roleName.trim();

    if (!trimmedRoleName) {
      return;
    }

    const roleKey = String(activeRoleId);

    /*
     * ONLY current active role's permissions are saved.
     */
    const permissionIds = selectedByRole[roleKey] ?? [];

    /*
     * A feature is included if at least one permission
     * under that feature is selected.
     */
    const featureIds =
      activeRole?.features
        .filter((feature) =>
          feature.permissions.some((permission) =>
            permissionIds.includes(String(permission.id)),
          ),
        )
        .map((feature) => feature.id) ?? [];

    const payload: RolePermissionSavePayload = {
      roleId: activeRoleId,
      roleName: trimmedRoleName,
      permissionIds,
      featureIds,
    };

    try {
      setSaving(true);

      await onSave?.(payload);
    } finally {
      setSaving(false);
    }
  }, [activeRole, activeRoleId, onSave, roleName, selectedByRole]);

  /* =======================================================
     RENDER
  ======================================================= */

  if (!open) {
    return null;
  }

  return (
    <Modal
      onClose={onClose}
      labelledBy="role-permission-modal-title"
      maxWidthClass="max-w-[1180px]"
    >
      {/* HEADER */}

      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-3">
        <div>
          <h2
            id="role-permission-modal-title"
            className="text-[15px] font-semibold text-[#009432]"
          >
            {title}
          </h2>

          {usingDemoData && (
            <p className="mt-0.5 text-[10px] text-amber-600">
              Demo data is being displayed because API data is unavailable.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-slate-700
          "
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      {/* BODY */}

      <div className="flex min-h-0 flex-1 flex-col">
        {/* ROLE TABS + SEARCH */}

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {data?.roles.map((item) => {
              const isActive = String(activeRoleId) === String(item.id);

              const selectedCount =
                selectedByRole[String(item.id)]?.length ?? 0;

              return (
                <button
                  key={String(item.id)}
                  type="button"
                  onClick={() => handleRoleChange(item.id)}
                  className={`
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    rounded
                    px-2.5
                    py-1.5
                    text-[10px]
                    font-medium
                    transition
                    ${
                      isActive
                        ? "bg-[#009432] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }
                  `}
                >
                  <span>{item.name}</span>

                  {selectedCount > 0 && (
                    <span
                      className={`
                        rounded-full
                        px-1.5
                        py-0.5
                        text-[8px]
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-500"
                        }
                      `}
                    >
                      {selectedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-[230px]">
            <Search
              size={13}
              className="
                pointer-events-none
                absolute
                left-2.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search features or permissions..."
              className="
                h-8
                w-full
                rounded-md
                border
                border-slate-200
                bg-white
                pl-8
                pr-2.5
                text-[10px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-[#009432]
                focus:ring-1
                focus:ring-[#009432]/20
              "
            />
          </div>
        </div>

        {/* ROLE NAME */}

        <div className="shrink-0 border-b border-slate-200 px-5 py-2.5">
          <div className="flex items-center gap-2">
            <label
              htmlFor="role-name"
              className="
                w-[70px]
                shrink-0
                text-[10px]
                font-medium
                text-slate-600
              "
            >
              Role Name
            </label>

            <input
              id="role-name"
              type="text"
              value={roleName}
              onChange={(event) => handleRoleNameChange(event.target.value)}
              placeholder="Enter role name"
              className="
                h-8
                w-full
                max-w-[320px]
                rounded-md
                border
                border-slate-200
                bg-white
                px-2.5
                text-[10px]
                text-slate-700
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-[#009432]
                focus:ring-1
                focus:ring-[#009432]/20
              "
            />
          </div>
        </div>

        {/* PERMISSION TABLE */}

        <div className="min-h-0 flex-1 overflow-auto px-5 py-3">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-[10px] text-slate-400">
                Loading permissions...
              </div>
            </div>
          ) : !activeRole ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-[10px] text-slate-400">No role found.</div>
            </div>
          ) : (
            <div className="overflow-hidden rounded border border-slate-200">
              {/* TABLE HEADER */}

              <div className="grid grid-cols-[210px_minmax(0,1fr)] border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 border-r border-slate-200 px-2.5 py-2">
                  <Checkbox
                    checked={allActiveSelected}
                    indeterminate={!allActiveSelected && someActiveSelected}
                    onChange={toggleAll}
                    ariaLabel="Select all permissions"
                  />

                  <button
                    type="button"
                    onClick={toggleAll}
                    className="
                      text-[10px]
                      font-semibold
                      text-slate-700
                    "
                  >
                    Features
                  </button>
                </div>

                <div className="flex items-center px-2.5 py-2">
                  <span
                    className="
                      text-[10px]
                      font-semibold
                      text-slate-700
                    "
                  >
                    Permissions
                  </span>
                </div>
              </div>

              {/* FEATURES */}

              {visibleFeatures.length === 0 ? (
                <div className="flex min-h-[120px] items-center justify-center">
                  <span className="text-[10px] text-slate-400">
                    No features or permissions found.
                  </span>
                </div>
              ) : (
                visibleFeatures.map((feature) => {
                  const featurePermissionIds = feature.permissions.map(
                    (permission) => String(permission.id),
                  );

                  const selectedCount = featurePermissionIds.filter((id) =>
                    selectedPermissionIds.has(id),
                  ).length;

                  const fullySelected =
                    featurePermissionIds.length > 0 &&
                    selectedCount === featurePermissionIds.length;

                  const partiallySelected =
                    selectedCount > 0 &&
                    selectedCount < featurePermissionIds.length;

                  return (
                    <div
                      key={String(feature.id)}
                      className="
                        grid
                        grid-cols-[210px_minmax(0,1fr)]
                        border-b
                        border-slate-200
                        last:border-b-0
                      "
                    >
                      {/* FEATURE */}

                      <div
                        className="
                          flex
                          min-h-[38px]
                          items-center
                          gap-2
                          border-r
                          border-slate-200
                          px-2.5
                        "
                      >
                        <Checkbox
                          checked={fullySelected}
                          indeterminate={partiallySelected}
                          onChange={() => toggleFeature(feature)}
                          ariaLabel={`Select ${feature.name}`}
                        />

                        <button
                          type="button"
                          onClick={() => toggleFeature(feature)}
                          className="
                            min-w-0
                            truncate
                            text-left
                            text-[9px]
                            font-medium
                            text-slate-700
                          "
                        >
                          {feature.name}
                        </button>
                      </div>

                      {/* PERMISSIONS */}

                      <div
                        className="
                          grid
                          grid-cols-1
                          gap-1
                          p-1.5
                          sm:grid-cols-2
                          lg:grid-cols-3
                          xl:grid-cols-4
                        "
                      >
                        {feature.permissions.map((permission) => {
                          const checked = selectedPermissionIds.has(
                            String(permission.id),
                          );

                          return (
                            <button
                              key={String(permission.id)}
                              type="button"
                              onClick={() => togglePermission(permission.id)}
                              className="
                                  flex
                                  cursor-pointer
                                  items-center
                                  gap-1.5
                                  rounded
                                  px-1
                                  py-0.5
                                  text-left
                                  transition
                                  hover:bg-slate-50
                                "
                            >
                              <Checkbox
                                checked={checked}
                                onChange={() => togglePermission(permission.id)}
                                ariaLabel={permission.name}
                              />

                              <span
                                className={`
                                    text-[9px]
                                    leading-4
                                    ${
                                      checked
                                        ? "font-medium text-slate-800"
                                        : "text-slate-500"
                                    }
                                  `}
                              >
                                {permission.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}

      <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-2.5">
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck size={13} className="text-[#009432]" />

          <span>{selectedPermissionIds.size} permissions selected</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
              rounded-md
              border
              border-slate-200
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-medium
              text-slate-600
              transition
              hover:bg-slate-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || loading || !activeRole || !roleName.trim()}
            className="
              rounded-md
              bg-[#009432]
              px-3
              py-1.5
              text-[10px]
              font-medium
              text-white
              transition
              hover:bg-[#007f2a]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
