import {
  Clipboard,
  Layout,
  SlidersHorizontal,
  User,
  User2,
} from 'lucide-react';

// Admin links data
export const ADMIN_LINKS = [
  {
    href: '/admin',
    icon: Layout,
    label: 'Dashboard',
  },
  {
    href: '/admin/categories',
    icon: Clipboard,
    label: 'Categories',
  },
  {
    href: '/admin/profile',
    icon: User2,
    label: 'Profile',
  },
  {
    href: '/admin/users',
    icon: User,
    label: 'Users',
  },
  {
    href: '/admin/settings',
    icon: SlidersHorizontal,
    label: 'Settings',
  },
];

// Seller links data
export const USER_LINKS = [
  {
    href: '/seller',
    icon: Layout,
    label: 'Dashboard',
  },
  {
    href: '/seller/inventory',
    icon: Clipboard,
    label: 'Inventory',
  },
  {
    href: '/seller/orders',
    icon: Clipboard,
    label: 'Orders',
  },
  {
    href: '/seller/users',
    icon: User,
    label: 'Users',
  },
  {
    href: '/seller/settings',
    icon: SlidersHorizontal,
    label: 'Settings',
  },
];

import { DashboardIcon } from '@radix-ui/react-icons';
import {
  BookOpen,
  NewspaperIcon,
  ShoppingBag,
} from 'lucide-react';

export const ADMIN_LINKS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: DashboardIcon,
  },
  {
    label: 'Resources',
    icon: BookOpen,
    submenu: [
      {
        label: 'Reports & Publications',
        href: '/admin/resources/reports-publications',
      },
      {
        label: 'Forms',
        href: '/admin/resources/forms',
      },
      {
        label: 'Council List',
        href: '/admin/resources/council-list',
      },
    ],
  },
  {
    label: 'News & Updates',
    icon: NewspaperIcon,
    submenu: [
      {
        label: 'News',
        href: '/admin/news-updates/news',
      },
      {
        label: 'Press Releases',
        href: '/admin/news-updates/press-releases',
      },
    ],
  },
  {
    label: 'Shops',
    href: '/admin/shops',
    icon: ShoppingBag,
  },
];

export const actionsDropdownItems = [
  {
    label: 'Rename',
    icon: '/assets/icons/edit.svg',
    value: 'rename',
  },
  {
    label: 'Details',
    icon: '/assets/icons/info.svg',
    value: 'details',
  },

  {
    label: 'Download',
    icon: '/assets/icons/download.svg',
    value: 'download',
  },
  {
    label: 'Delete',
    icon: '/assets/icons/delete.svg',
    value: 'delete',
  },
];

export const sortTypes = [
  {
    label: 'Date created (newest)',
    value: '$createdAt-desc',
  },
  {
    label: 'Created Date (oldest)',
    value: '$createdAt-asc',
  },
  {
    label: 'Name (A-Z)',
    value: 'name-asc',
  },
  {
    label: 'Name (Z-A)',
    value: 'name-desc',
  },
  {
    label: 'Size (Highest)',
    value: 'size-desc',
  },
  {
    label: 'Size (Lowest)',
    value: 'size-asc',
  },
];

export const avatarPlaceholderUrl =
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
