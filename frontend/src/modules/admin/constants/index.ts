import {
  Book,
  BookOpen,
  Briefcase,
  Calendar,
  LayoutGrid,
  MessageCircle,
  NewspaperIcon,
  ShoppingBag,
  UsersIcon,
  Wrench,
} from 'lucide-react'; // Adjust import path for icons if needed
import { SidebarProps } from '../sidebar';

export const ADMIN_LINKS: SidebarProps[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutGrid,
  },
  {
    label: 'Resources',
    icon: BookOpen,
    submenu: [
      {
        label: ' Publications',
        href: '/admin/resources/reports-publications',
      },
      {
        label: 'Current Forms',
        href: '/admin/resources/forms-documents',
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
    href: '/admin/news-updates/news',
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
  {
    label: 'Users',
    href: '/admin/users',
    icon: UsersIcon, // Replace with the appropriate icon if `UsersIcon` is unavailable
  },
  {
    label: 'Events',
    href: '/admin/events',
    icon: Calendar,
  },
  {
    label: 'Vacancies',
    href: '/admin/vacancies',
    icon: Briefcase,
  },
  {
    label: 'Services',
    href: '/admin/services',
    icon: Wrench,
  },
  {
    label: 'Messaging', // New "Messaging" section
    href: '/admin/messages', // Path for the messaging section
    icon: MessageCircle, // Icon for messaging
  },
];

export const actionsDropdownItems = [
  {
    label: 'Edit',
    icon: '/assets/icons/edit.svg',
    value: 'edit',
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

export const adminActionsDropdownItems = [
  {
    label: 'Edit',
    icon: '/assets/icons/edit.svg',
    value: 'edit',
  },
  {
    label: 'Details',
    icon: '/assets/icons/info.svg',
    value: 'details',
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
