import AmbientMesh from '@/components/AmbientMesh';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 relative overflow-hidden">
      <AmbientMesh />
      <div className="w-full max-w-md md:max-w-lg min-h-[500px] p-6 md:p-8">{children}</div>
    </div>
  );
}
