'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FolderKanban,
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  ExternalLink,
} from 'lucide-react';
import styles from './AdminUI.module.scss';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard },
    { href: '/admin/services', label: 'Services', icon: Package },
    { href: '/admin/services/new', label: 'New Service', icon: PlusCircle },
    { href: '/admin/categories', label: 'Categories', icon: FolderKanban },
    { href: '/admin/settings', label: 'Website Settings', icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brandRow}>
          <Package size={22} color="#06b6d4" />
          <span>NovaStream Admin</span>
        </div>

        <nav className={styles.navList} aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin' || item.href === '/admin/services'
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  isActive ? styles.navItemActive : ''
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <Link href="/" className={styles.navItem} target="_blank">
          <ExternalLink size={17} />
          <span>View Public Storefront</span>
        </Link>
      </div>
    </aside>
  );
}

