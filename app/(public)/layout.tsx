import { PublicNav } from '@/components/layout/PublicNav';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
