import { Icon } from '@iconify/react';

// Define a type for a navigation item, including optional icon and submenu fields.
export type NavItem = {
  title: string;
  href: string;
  description?: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: NavItem[];
};

// Create and export the navigation items object.
export const navItems: NavItem[] = [
  {
    title: 'Genres',
    href: '#', // Main path for genres, can be updated as needed.
    submenu: true,
    subMenuItems: [
      {
        title: 'Pop',
        href: '/genres/pop',
        description:
          'Top pop hits and new releases.',
        icon: (
          <Icon
            icon='lucide:music'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Rock',
        href: '/genres/rock',
        description:
          'Classic rock and modern hits.',
        icon: (
          <Icon
            icon='lucide:drum'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Hip-Hop/Rap',
        href: '/genres/hip-hop-rap',
        description:
          'The latest in hip-hop and rap.',
        icon: (
          <Icon
            icon='lucide:mic'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Jazz',
        href: '/genres/jazz',
        description:
          'Smooth jazz and contemporary sounds.',
        icon: (
          <Icon
            icon='lucide:guitar'
            width='16'
            height='16'
          />
        ),
      },
      // Add more genres as needed
    ],
  },
  {
    title: 'Top Charts',
    href: '#', // Main path for top charts, can be updated as needed.
    submenu: true,
    subMenuItems: [
      {
        title: 'Top 10 This Week',
        href: '/top-charts/top-10-this-week',
        description:
          'Most popular songs this week.',
        icon: (
          <Icon
            icon='lucide:trending-up'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Most Popular',
        href: '/top-charts/most-popular',
        description: 'Songs everyone is loving.',
        icon: (
          <Icon
            icon='lucide:heart'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'New Releases',
        href: '/top-charts/new-releases',
        description:
          'Fresh songs and albums just for you.',
        icon: (
          <Icon
            icon='lucide:sparkles'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Trending Now',
        href: '/top-charts/trending-now',
        description: 'Currently trending tracks.',
        icon: (
          <Icon
            icon='lucide:flame'
            width='16'
            height='16'
          />
        ),
      },
      // Add more top charts as needed
    ],
  },
  {
    title: 'Explore',
    href: '#', // Main path for explore, can be updated as needed.
    submenu: true,
    subMenuItems: [
      {
        title: 'Discover New Artists',
        href: '/explore/new-artists',
        description:
          'Emerging talents and new artists.',
        icon: (
          <Icon
            icon='lucide:user'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Recommended For You',
        href: '/explore/recommended',
        description: 'Personalized music picks.',
        icon: (
          <Icon
            icon='lucide:thumbs-up'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Top Playlists',
        href: '/explore/top-playlists',
        description:
          'Curated playlists to match your mood.',
        icon: (
          <Icon
            icon='lucide:square-play'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Live & Acoustic',
        href: '/explore/live-acoustic',
        description:
          'Unplugged and live performances.',
        icon: (
          <Icon
            icon='lucide:mic-vocal'
            width='16'
            height='16'
          />
        ),
      },
      // Add more explore items as needed
    ],
  },
  {
    title: 'About',
    href: '/about-us', // The main path for categories, can be updated as needed.
  },
];
