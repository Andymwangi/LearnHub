import Link from "next/link";
import { AuthBanner } from "@/components/auth-banner";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 dark:border-neutral-800 py-4 lg:hidden">
        <div className="container flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Learn<span className="text-primary">Hub</span>
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            Back to home
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Auth banner takes up half the screen on large displays */}
        <div className="w-full lg:w-1/2 lg:h-screen">
          <AuthBanner />
        </div>
        
        {/* Auth forms take up the other half */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="lg:hidden space-y-2 text-center mb-8">
              <h2 className="text-3xl font-bold">Welcome to LearnHub</h2>
              <p className="text-muted-foreground">Your journey to knowledge starts here</p>
            </div>
            
            {children}
            
            <div className="hidden lg:block absolute top-4 right-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-4 lg:hidden">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LearnHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 