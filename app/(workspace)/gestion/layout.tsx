export default function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='bg-[#ffffff78] py-5 px-4 rounded-[12px] w-full h-[85vh]'>{children}</div>;
}
