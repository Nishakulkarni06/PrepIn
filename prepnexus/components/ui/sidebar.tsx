'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function ProfileSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Profile', path: '/profile' },
    { name: 'Performance', path: '/profile/performance' },
    { name: 'Account', path: '/profile/account' },
  ];

  return (
    <aside className="w-52 bg-[#F4F0EB] p-8 flex flex-col justify-between items-center h-full">
      <div className="flex flex-col items-center gap-4 bg-white p-4 rounded-md shadow-md w-full mt-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              'block px-4 py-2 rounded-md text-center font-medium w-full text-sm',
              pathname === item.path
                ? 'bg-[#0074D9] text-white'
                : 'text-black hover:bg-gray-200'
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
