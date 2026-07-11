import AmbientMesh from '@/components/AmbientMesh';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 relative overflow-hidden">
      <AmbientMesh />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
