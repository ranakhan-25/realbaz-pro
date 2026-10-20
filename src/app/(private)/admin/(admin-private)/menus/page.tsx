"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Tooltip,
  Tree,
  Typography,
  message,
} from "antd";

import type { DataNode, TreeProps } from "antd/es/tree";
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import type { MenuTreeNode } from "@/types/interface/menuServices";
import { generateSlug } from "@/lib/generateSlug";
import { useTheme } from "@/lib/theme";

const { Text } = Typography;

const BORDER_COLOR = "#e5e7eb";

const STATIC_MODULE_ID = 1;
const STATIC_MODULE_NAME = "HRMS";

/* =========================================================
   STATIC MENU DATA
========================================================= */

const STATIC_MENU_TREE: MenuTreeNode[] = [
  {
    id: 1,
    title: "Dashboard",
    url: "/dashboard",
    target: "_self",
    moduleId: STATIC_MODULE_ID,
    parentId: null,
    order: 1,
    isVisible: true,
    isPublic: false,
    children: [],
    location: "SIDEBAR",
  },
  {
    id: 2,
    title: "Users",
    url: "/users",
    target: "_self",
    moduleId: STATIC_MODULE_ID,
    parentId: null,
    order: 2,
    isVisible: true,
    isPublic: false,
    children: [
      {
        id: 3,
        title: "All Users",
        url: "/users",
        target: "_self",
        moduleId: STATIC_MODULE_ID,
        parentId: 2,
        order: 1,
        isVisible: true,
        isPublic: false,
        children: [],
        location: "SIDEBAR",
      },
      {
        id: 4,
        title: "Roles",
        url: "/roles",
        target: "_self",
        moduleId: STATIC_MODULE_ID,
        parentId: 2,
        order: 2,
        isVisible: true,
        isPublic: false,
        children: [],
        location: "SIDEBAR",
      },
    ],
    location: "SIDEBAR",
  },
  {
    id: 5,
    title: "Features",
    url: "/features",
    target: "_self",
    moduleId: STATIC_MODULE_ID,
    parentId: null,
    order: 3,
    isVisible: true,
    isPublic: false,
    children: [],
    location: "SIDEBAR",
  },
  {
    id: 6,
    title: "Menu Management",
    url: "/menu-management",
    target: "_self",
    moduleId: STATIC_MODULE_ID,
    parentId: null,
    order: 4,
    isVisible: true,
    isPublic: false,
    children: [],
    location: "SIDEBAR",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function cloneTree(nodes: MenuTreeNode[]): MenuTreeNode[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children?.length ? cloneTree(node.children) : [],
  }));
}

function flattenTree(nodes: MenuTreeNode[]): MenuTreeNode[] {
  const result: MenuTreeNode[] = [];

  nodes.forEach((node) => {
    result.push(node);
    if (node.children?.length) {
      result.push(...flattenTree(node.children));
    }
  });

  return result;
}

function findNode(nodes: MenuTreeNode[], id: number): MenuTreeNode | undefined {
  for (const node of nodes) {
    if (Number(node.id) === Number(id)) return node;
    if (node.children?.length) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function getAllTreeKeys(nodes: MenuTreeNode[]): React.Key[] {
  const keys: React.Key[] = [];
  nodes.forEach((node) => {
    keys.push(node.id);
    if (node.children?.length) {
      keys.push(...getAllTreeKeys(node.children));
    }
  });
  return keys;
}

function containsNode(nodes: MenuTreeNode[], targetId: number): boolean {
  return Boolean(findNode(nodes, targetId));
}

function removeNode(
  nodes: MenuTreeNode[],
  targetId: number,
): {
  nodes: MenuTreeNode[];
  removedNode?: MenuTreeNode;
} {
  let removedNode: MenuTreeNode | undefined;
  const nextNodes: MenuTreeNode[] = [];

  for (const node of nodes) {
    if (Number(node.id) === Number(targetId)) {
      removedNode = node;
      continue;
    }

    let nextNode = node;
    if (node.children?.length) {
      const result = removeNode(node.children, targetId);
      if (result.removedNode) removedNode = result.removedNode;
      nextNode = { ...node, children: result.nodes };
    }
    nextNodes.push(nextNode);
  }

  return { nodes: nextNodes, removedNode };
}

function normalizeParentIds(
  nodes: MenuTreeNode[],
  parentId: number | null = null,
): MenuTreeNode[] {
  return nodes.map((node, index) => ({
    ...node,
    parentId,
    order: index + 1,
    children: node.children?.length
      ? normalizeParentIds(node.children, Number(node.id))
      : [],
  }));
}

function getNextMenuId(nodes: MenuTreeNode[]): number {
  const allNodes = flattenTree(nodes);
  if (!allNodes.length) return 1;
  return Math.max(...allNodes.map((node) => Number(node.id))) + 1;
}

function updateNodeInTree(
  nodes: MenuTreeNode[],
  targetId: number,
  updater: (node: MenuTreeNode) => MenuTreeNode,
): MenuTreeNode[] {
  return nodes.map((node) => {
    if (Number(node.id) === Number(targetId)) return updater(node);
    return {
      ...node,
      children: node.children?.length
        ? updateNodeInTree(node.children, targetId, updater)
        : [],
    };
  });
}

function findNodeContext(
  nodes: MenuTreeNode[],
  targetId: number,
  parentId: number | null = null,
): { node: MenuTreeNode; parentId: number | null } | null {
  for (const node of nodes) {
    if (Number(node.id) === Number(targetId)) {
      return { node, parentId };
    }
    if (node.children?.length) {
      const result = findNodeContext(node.children, targetId, Number(node.id));
      if (result) return result;
    }
  }
  return null;
}

/* =========================================================
   FORM TYPE
========================================================= */

interface MenuFormValues {
  title: string;
  url: string;
  target: "_self" | "_blank";
  elementClass?: string;
  elementId?: string;
  icon?: string;
  description?: string;
  parentId?: number | null;
  moduleId?: number;
  isVisible: boolean;
  isPublic: boolean;
}

/* =========================================================
   PAGE
========================================================= */

export default function MenuManagementPage() {
  const [form] = Form.useForm<MenuFormValues>();
  const { primaryColor } = useTheme();

  const [treeNodes, setTreeNodes] = useState<MenuTreeNode[]>(
    cloneTree(STATIC_MENU_TREE),
  );
  const [selectedMenuId, setSelectedMenuId] = useState<number | undefined>();
  const [editingMenu, setEditingMenu] = useState<MenuTreeNode | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(
    getAllTreeKeys(STATIC_MENU_TREE),
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedMenu = useMemo(() => {
    if (!selectedMenuId) return undefined;
    return findNode(treeNodes, selectedMenuId);
  }, [treeNodes, selectedMenuId]);

  const moduleOptions = useMemo(
    () => [{ label: STATIC_MODULE_NAME, value: STATIC_MODULE_ID }],
    [],
  );

  const parentOptions = useMemo(() => {
    const allNodes = flattenTree(treeNodes);
    return [
      { label: "Root", value: null },
      ...allNodes
        .filter((node) => Number(node.id) !== Number(selectedMenuId))
        .map((node) => ({
          label: node.title,
          value: Number(node.id),
        })),
    ];
  }, [treeNodes, selectedMenuId]);

  const treeData = useMemo<DataNode[]>(() => {
    const convert = (nodes: MenuTreeNode[]): DataNode[] =>
      nodes.map((node) => ({
        key: node.id,
        title: (
          <div className="flex w-full items-center justify-between gap-3 py-1">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={
                  node.isVisible
                    ? "font-medium text-foreground"
                    : "font-medium text-muted-foreground line-through"
                }
              >
                {node.title}
              </span>
              {node.url ? (
                <span className="truncate text-xs text-muted-foreground">
                  {node.url}
                </span>
              ) : null}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              #{node.order}
            </span>
          </div>
        ),
        children: node.children?.length ? convert(node.children) : undefined,
      }));

    return convert(treeNodes);
  }, [treeNodes]);

  const handleSelect: TreeProps["onSelect"] = (keys) => {
    const id = Number(keys[0]);
    if (!id) return;

    const node = findNode(treeNodes, id);
    if (!node) return;

    setSelectedMenuId(id);
    setEditingMenu(node);

    form.setFieldsValue({
      title: node.title,
      url: node.url ?? "",
      target: node.target === "_blank" ? "_blank" : "_self",
      elementClass: node.elementClass ?? "",
      elementId: node.elementId ?? "",
      icon: node.icon ?? "",
      description: node.description ?? "",
      parentId: node.parentId ?? null,
      moduleId: node.moduleId ?? STATIC_MODULE_ID,
      isVisible: node.isVisible ?? true,
      isPublic: node.isPublic ?? false,
    });
  };

  const handleCreate = useCallback(() => {
    setSelectedMenuId(undefined);
    setEditingMenu(null);
    form.resetFields();
    form.setFieldsValue({
      title: "",
      url: "",
      target: "_self",
      elementClass: "",
      elementId: "",
      icon: "",
      description: "",
      parentId: null,
      moduleId: STATIC_MODULE_ID,
      isVisible: true,
      isPublic: false,
    });
  }, [form]);

  const handleEdit = useCallback(
    (node: MenuTreeNode) => {
      setSelectedMenuId(Number(node.id));
      setEditingMenu(node);
      form.setFieldsValue({
        title: node.title,
        url: node.url ?? "",
        target: node.target === "_blank" ? "_blank" : "_self",
        elementClass: node.elementClass ?? "",
        elementId: node.elementId ?? "",
        icon: node.icon ?? "",
        description: node.description ?? "",
        parentId: node.parentId ?? null,
        moduleId: node.moduleId ?? STATIC_MODULE_ID,
        isVisible: node.isVisible ?? true,
        isPublic: node.isPublic ?? false,
      });
    },
    [form],
  );

  const handleDelete = useCallback(
    (id: number) => {
      const result = removeNode(treeNodes, id);
      const normalizedTree = normalizeParentIds(result.nodes);
      setTreeNodes(normalizedTree);

      if (Number(selectedMenuId) === Number(id)) {
        setSelectedMenuId(undefined);
        setEditingMenu(null);
        form.resetFields();
      }

      message.success("Menu deleted successfully.");
    },
    [treeNodes, selectedMenuId, form],
  );

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);

      const title = values.title.trim();
      const url = values.url?.trim() || generateSlug(title);

      if (editingMenu) {
        const updatedTree = updateNodeInTree(
          treeNodes,
          Number(editingMenu.id),
          (node) => ({
            ...node,
            title,
            url,
            target: values.target,
            elementClass: values.elementClass?.trim() || "",
            elementId: values.elementId?.trim() || "",
            icon: values.icon?.trim() || "",
            description: values.description?.trim() || "",
            moduleId: values.moduleId ?? STATIC_MODULE_ID,
            isVisible: values.isVisible,
            isPublic: values.isPublic,
          }),
        );

        const normalizedTree = normalizeParentIds(updatedTree);
        setTreeNodes(normalizedTree);

        const updatedNode = findNode(normalizedTree, Number(editingMenu.id));
        if (updatedNode) setEditingMenu(updatedNode);

        message.success("Menu updated successfully.");
      } else {
        const newId = getNextMenuId(treeNodes);
        const parentId = values.parentId ? Number(values.parentId) : null;

        const newMenu: MenuTreeNode = {
          id: newId,
          title,
          url,
          target: values.target,
          moduleId: values.moduleId ?? STATIC_MODULE_ID,
          parentId,
          order: 0,
          isVisible: values.isVisible,
          isPublic: values.isPublic,
          elementClass: values.elementClass?.trim() || "",
          elementId: values.elementId?.trim() || "",
          icon: values.icon?.trim() || "",
          description: values.description?.trim() || "",
          children: [],
          location: "SIDEBAR",
        };

        let nextTree: MenuTreeNode[];

        if (parentId) {
          nextTree = updateNodeInTree(treeNodes, parentId, (node) => ({
            ...node,
            children: [...(node.children ?? []), newMenu],
          }));
        } else {
          nextTree = [...treeNodes, newMenu];
        }

        const normalizedTree = normalizeParentIds(nextTree);
        setTreeNodes(normalizedTree);
        setSelectedMenuId(newId);

        const createdNode = findNode(normalizedTree, newId);
        setEditingMenu(createdNode ?? null);

        message.success("Menu created successfully.");
      }
    } catch {
      message.error("Please check the form fields.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    const freshTree = cloneTree(STATIC_MENU_TREE);
    setTreeNodes(freshTree);
    setSelectedMenuId(undefined);
    setEditingMenu(null);
    setExpandedKeys(getAllTreeKeys(freshTree));
    form.resetFields();
    message.success("Static menu reset successfully.");
  };

  const handleRefresh = () => {
    const freshTree = cloneTree(STATIC_MENU_TREE);
    setTreeNodes(freshTree);
    setExpandedKeys(getAllTreeKeys(freshTree));
    setSelectedMenuId(undefined);
    setEditingMenu(null);
    form.resetFields();
    message.success("Menu refreshed.");
  };

  const handleDrop: TreeProps["onDrop"] = (info) => {
    const dragKey = Number(info.dragNode.key);
    const dropKey = Number(info.node.key);

    if (dragKey === dropKey) return;

    const draggedOriginal = findNode(treeNodes, dragKey);
    if (!draggedOriginal) return;

    if (containsNode(draggedOriginal.children ?? [], dropKey)) {
      message.warning("A menu cannot be moved inside its own child.");
      return;
    }

    const result = removeNode(treeNodes, dragKey);
    const draggedNode = result.removedNode;
    if (!draggedNode) return;

    let nextTree = result.nodes;

    if (info.dropToGap) {
      const context = findNodeContext(nextTree, dropKey);
      if (!context) return;

      const parentId = context.parentId;

      if (parentId === null) {
        const dropIndex = nextTree.findIndex(
          (node) => Number(node.id) === Number(dropKey),
        );
        if (dropIndex !== -1) {
          nextTree.splice(dropIndex + 1, 0, {
            ...draggedNode,
            parentId: null,
          });
        }
      } else {
        nextTree = updateNodeInTree(nextTree, parentId, (node) => {
          const children = [...(node.children ?? [])];
          const dropIndex = children.findIndex(
            (child) => Number(child.id) === Number(dropKey),
          );
          if (dropIndex === -1) return node;

          children.splice(dropIndex + 1, 0, {
            ...draggedNode,
            parentId: Number(parentId),
          });

          return { ...node, children };
        });
      }
    } else {
      nextTree = updateNodeInTree(nextTree, dropKey, (node) => ({
        ...node,
        children: [
          ...(node.children ?? []),
          { ...draggedNode, parentId: Number(dropKey) },
        ],
      }));
    }

    const normalizedTree = normalizeParentIds(nextTree);
    setTreeNodes(normalizedTree);
    setIsDragging(false);
    message.success("Menu order updated.");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-[1600px]">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Menu Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your static sidebar menu structure.
            </p>
          </div>

          <Space wrap>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>

            <Button onClick={handleReset}>Reset</Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{
                backgroundColor: primaryColor,
                borderColor: primaryColor,
              }}
            >
              Add Menu
            </Button>
          </Space>
        </div>

        {/* CONTENT */}
        <Row gutter={[16, 16]}>
          {/* LEFT SIDE */}
          <Col xs={24} lg={10} xl={9}>
            <Card
              title={
                <div className="flex items-center justify-between">
                  <span>Menu Structure</span>
                  <Text type="secondary">
                    {flattenTree(treeNodes).length} items
                  </Text>
                </div>
              }
              styles={{ body: { padding: 12 } }}
              style={{ borderColor: BORDER_COLOR }}
            >
              {treeNodes.length > 0 ? (
                <Tree
                  blockNode
                  draggable
                  showLine
                  switcherIcon={<DownOutlined />}
                  selectedKeys={selectedMenuId ? [selectedMenuId] : []}
                  expandedKeys={expandedKeys}
                  treeData={treeData}
                  onSelect={handleSelect}
                  onExpand={(keys) => setExpandedKeys(keys)}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={isDragging ? "opacity-70" : ""}
                />
              ) : (
                <Empty description="No menus found" />
              )}
            </Card>
          </Col>

          {/* RIGHT SIDE */}
          <Col xs={24} lg={14} xl={15}>
            <Card
              title={
                editingMenu
                  ? `Edit Menu: ${editingMenu.title}`
                  : "Create New Menu"
              }
              style={{ borderColor: BORDER_COLOR }}
              extra={
                editingMenu ? (
                  <Space>
                    <Tooltip title="Delete menu">
                      <Popconfirm
                        title="Delete this menu?"
                        description="This action cannot be undone."
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(Number(editingMenu.id))}
                      >
                        <Button danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Tooltip>
                  </Space>
                ) : null
              }
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  target: "_self",
                  moduleId: STATIC_MODULE_ID,
                  parentId: null,
                  isVisible: true,
                  isPublic: false,
                }}
              >
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Menu Title"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "Please enter menu title.",
                        },
                      ]}
                    >
                      <Input
                        placeholder="e.g. Users"
                        onChange={(event) => {
                          const title = event.target.value;
                          if (!editingMenu && title.trim()) {
                            form.setFieldValue("url", generateSlug(title));
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="URL"
                      name="url"
                      rules={[
                        {
                          required: true,
                          message: "Please enter URL.",
                        },
                      ]}
                    >
                      <Input placeholder="/users" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Parent Menu" name="parentId">
                      <Select
                        showSearch
                        allowClear
                        placeholder="Select parent"
                        options={parentOptions}
                        optionFilterProp="label"
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Module" name="moduleId">
                      <Select options={moduleOptions} />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Target" name="target">
                      <Select
                        options={[
                          { label: "Same Window", value: "_self" },
                          { label: "New Window", value: "_blank" },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Icon" name="icon">
                      <Input placeholder="e.g. UserOutlined" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Element Class" name="elementClass">
                      <Input placeholder="Optional CSS class" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item label="Element ID" name="elementId">
                      <Input placeholder="Optional element ID" />
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item label="Description" name="description">
                      <Input.TextArea rows={4} placeholder="Menu description" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Visible"
                      name="isVisible"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Public"
                      name="isPublic"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                </Row>

                {/* ACTIONS */}
                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                  <Button onClick={handleCreate}>Clear</Button>

                  <Button
                    type="primary"
                    icon={isSaving ? <Spin size="small" /> : <SaveOutlined />}
                    loading={isSaving}
                    onClick={handleSave}
                    style={{
                      backgroundColor: primaryColor,
                      borderColor: primaryColor,
                    }}
                  >
                    {editingMenu ? "Update Menu" : "Create Menu"}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* INFO */}
        <div className="mt-4 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-foreground">
              Static Menu Mode
            </span>
            <span className="text-sm text-muted-foreground">
              This page currently uses local static menu data. Create, edit,
              delete and drag-and-drop changes are maintained locally during the
              current session.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
