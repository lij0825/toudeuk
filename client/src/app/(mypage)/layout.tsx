export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="">
        <section
          className="absolute top-12 w-full"
          style={{ height: "calc(100vh - 3rem)" }}
        >
          {children}
        </section>
      </div>
    </>
  );
}
