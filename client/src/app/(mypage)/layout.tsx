export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col min-h-screen max-h-screen">
        <div className="p-td"></div>
        <section className="flex-grow">{children}</section>
      </div>
    </>
  );
}
