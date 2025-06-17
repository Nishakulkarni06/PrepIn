// app/(root)/profile/layout.tsx
import ProfileSidebar from '@/components/ui/sidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <ProfileSidebar />
      <div className="flex-1   bg-[#F4F0EB] p-6 overflow-auto">{children}</div>
    </div>
  );
}
