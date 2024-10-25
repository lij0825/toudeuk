export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen max-h-screen">
        <div className="p-td"></div>
        <section>{children}</section>;
      </div>
    </>
  );
}
