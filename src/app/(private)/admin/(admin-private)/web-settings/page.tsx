"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Switch,
  Typography,
  message,
  ColorPicker,
  Upload,
  Divider,
} from "antd";
import {
  SaveOutlined,
  GlobalOutlined,
  UploadOutlined,
  BgColorsOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useTheme } from "@/lib/theme";

const { Title, Text } = Typography;

interface WebSettingsFormValues {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  footerText: string;
  maintenanceMode: boolean;
}

export default function WebManagementPage() {
  const [form] = Form.useForm<WebSettingsFormValues>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { primaryColor, setPrimaryColor } = useTheme();

  // Load initial settings + current theme primary color
  useEffect(() => {
    form.setFieldsValue({
      siteName: "My Enterprise App",
      tagline: "Building scalable web solutions",
      logoUrl: "https://example.com/logo.png",
      faviconUrl: "https://example.com/favicon.ico",
      primaryColor: primaryColor || "#2ed573",
      footerText: "© 2026 Enterprise Corp. All rights reserved.",
      maintenanceMode: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]); // শুধু mount এ একবার

  const handleSaveSettings = async (values: WebSettingsFormValues) => {
    setLoading(true);
    try {
      // Normalize color value (ColorPicker can return object)
      const nextPrimaryColor =
        typeof values.primaryColor === "object"
          ? (values.primaryColor as any).toHexString()
          : values.primaryColor;

      const payload = {
        ...values,
        primaryColor: nextPrimaryColor,
      };

      // ✅ Update global theme primary color
      if (nextPrimaryColor) {
        setPrimaryColor(nextPrimaryColor);
      }

      // API call placeholder:
      // await updateWebSettings(payload).unwrap();

      messageApi.success("Web settings updated successfully!");
    } catch (error: any) {
      messageApi.error(error?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100%", background: "#ffffff", padding: 24 }}>
      {contextHolder}

      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            Web Management
          </Title>
          <Text type="secondary">
            Configure site identity, branding assets, and overall website
            preferences.
          </Text>
        </div>

        <Button icon={<ReloadOutlined />} onClick={() => form.resetFields()}>
          Reset Form
        </Button>
      </div>

      {/* SETTINGS CARD */}
      <Card bordered style={{ borderRadius: 12, maxWidth: 1000 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveSettings}
          requiredMark="optional"
        >
          {/* BRANDING SECTION */}
          <Title level={5} style={{ marginBottom: 16 }}>
            <GlobalOutlined style={{ marginRight: 8 }} /> Site Identity
          </Title>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Website Name"
                name="siteName"
                rules={[
                  { required: true, message: "Please enter website name" },
                ]}
              >
                <Input size="large" placeholder="e.g. My Website" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Tagline / Slogan" name="tagline">
                <Input size="large" placeholder="e.g. Innovation First" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Logo Image URL" name="logoUrl">
                <Input
                  size="large"
                  placeholder="https://example.com/logo.png"
                  suffix={
                    <Upload showUploadList={false}>
                      <Button
                        icon={<UploadOutlined />}
                        type="text"
                        size="small"
                      >
                        Upload
                      </Button>
                    </Upload>
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Favicon URL" name="faviconUrl">
                <Input
                  size="large"
                  placeholder="https://example.com/favicon.ico"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* THEME & APPEARANCE SECTION */}
          <Title level={5} style={{ marginBottom: 16 }}>
            <BgColorsOutlined style={{ marginRight: 8 }} /> Appearance &
            Controls
          </Title>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Primary Brand Color"
                name="primaryColor"
                getValueFromEvent={(color) => {
                  // ColorPicker returns Color object → convert to hex string
                  if (color && typeof color === "object" && color.toHexString) {
                    return color.toHexString();
                  }
                  return color;
                }}
              >
                <ColorPicker
                  showText
                  format="hex"
                  size="large"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Maintenance Mode"
                name="maintenanceMode"
                valuePropName="checked"
                extra="Enabling this will restrict public access to the website."
              >
                <Switch
                  checkedChildren="Enabled"
                  unCheckedChildren="Disabled"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Footer Copyright Text" name="footerText">
            <Input.TextArea
              rows={3}
              placeholder="© 2026 Your Company. All rights reserved."
            />
          </Form.Item>

          <Divider />

          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
            size="large"
            style={{
              background: primaryColor,
              borderColor: primaryColor,
              paddingLeft: 32,
              paddingRight: 32,
            }}
          >
            Save Changes
          </Button>
        </Form>
      </Card>
    </div>
  );
}
