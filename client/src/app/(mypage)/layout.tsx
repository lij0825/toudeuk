export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute top-12 w-full"
      style={{ height: "calc(100vh - 3rem)" }}
    >
      <div className="bottom-sheet h-full">{children}</div>
    </div>
  );
}
