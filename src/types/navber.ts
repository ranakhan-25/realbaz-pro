// src/types/navbar.ts
export interface NavbarUser {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface NavbarProps {
  user?: NavbarUser;
  hasNotification?: boolean;
  onSearch?: (value: string) => void;
}
