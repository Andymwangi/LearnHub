import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | LearnHub",
  description: "Your LearnHub shopping cart",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
} 