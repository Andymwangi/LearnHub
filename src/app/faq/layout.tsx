import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | LearnHub",
  description: "Frequently asked questions about LearnHub",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
} 