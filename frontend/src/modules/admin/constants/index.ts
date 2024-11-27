import { DashboardIcon } from '@radix-ui/react-icons';
import {
  Book,
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
  {
    label: 'Blogs',
    href: '/admin/blogs',
    icon: Book,
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
export const clientActionsDropdownItems = [
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
