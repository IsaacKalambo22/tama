import { Icon } from '@iconify/react';
import { JSX } from 'react';

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
    title: 'Tobacco Business',
    href: '/tobacco-business',
    submenu: true,
    subMenuItems: [
      {
        title: 'Services',
        href: '/tobacco-business/services',
        description:
          'Various business services for the tobacco industry.',
        icon: (
          <Icon
            icon='lucide:briefcase'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Event Calendar',
        href: '/tobacco-business/event-calendar',
        description:
          'Upcoming industry events and important dates.',
        icon: (
          <Icon
            icon='lucide:calendar'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Shops',
        href: '/tobacco-business/shops',
        description:
          'Local and online shops for tobacco products.',
        icon: (
          <Icon
            icon='lucide:shopping-bag'
            width='16'
            height='16'
          />
        ),
      },
    ],
  },
  {
    title: 'Resources',
    href: '/resources',
    submenu: true,
    subMenuItems: [
      {
        title: 'Reports & Publications',
        href: '/resources/reports-publications',
        description:
          'Research and publications related to tobacco.',
        icon: (
          <Icon
            icon='lucide:book-open'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Forms',
        href: '/resources/forms',
        description:
          'Documents and forms for industry use.',
        icon: (
          <Icon
            icon='lucide:file-text'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Council List',
        href: '/resources/council-list',
        description:
          'List of council members and representatives.',
        icon: (
          <Icon
            icon='lucide:list'
            width='16'
            height='16'
          />
        ),
      },
      {
        title: 'Vacancies',
        href: '/resources/vacancies',
        description:
          'Open job positions and career opportunities.',
        icon: (
          <Icon
            icon='lucide:briefcase'
            width='16'
            height='16'
          />
        ),
      },
    ],
  },
  {
    title: 'News & Updates',
    href: '/news-updates/news',
    submenu: true,
    // subMenuItems: [
    //   {
    //     title: 'News',
    //     href: '/news-updates/news',
    //     description:
    //       'Latest news in the tobacco industry.',
    //     icon: (
    //       <Icon
    //         icon='lucide:newspaper'
    //         width='16'
    //         height='16'
    //       />
    //     ),
    //   },
    //   {
    //     title: 'Press Releases',
    //     href: '/news-updates/press-release',
    //     description:
    //       'Official statements and press releases.',
    //     icon: (
    //       <Icon
    //         icon='lucide:megaphone'
    //         width='16'
    //         height='16'
    //       />
    //     ),
    //   },
    // ],
  },

  {
    title: 'Blogs',
    href: '/blogs',
    description:
      'Industry insights and articles from experts.',
    icon: (
      <Icon
        icon='lucide:pen-tool'
        width='16'
        height='16'
      />
    ),
  },
  // {
  //   title: 'About Us',
  //   href: '/about-us',
  //   description:
  //     'Learn more about our organization and mission.',
  //   icon: (
  //     <Icon
  //       icon='lucide:info'
  //       width='16'
  //       height='16'
  //     />
  //   ),
  // },
];
