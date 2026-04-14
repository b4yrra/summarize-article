import { UserButton } from "@clerk/nextjs";

export function Topbar() {
  return (
    <header className="flex items-center justify-between h-13 px-5 bg-background border-b border-border shrink-0">
      <span className="text-sm font-medium">Quiz app</span>
      <UserButton />
    </header>
  );
}
