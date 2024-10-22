export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col justify-center align-middle items-center min-h-screen">
        {children}
      </div>
    </>
  );
}
