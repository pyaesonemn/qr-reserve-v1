import Sidebar from "./components/Sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row gap-x-3 p-3 h-screen">
      <Sidebar />
      <div className="flex-1 bg-neutral-100 rounded-3xl">{children}</div>
    </div>
  );
}
