import ConversationsList from "./components/conversationsList";
export default function MessageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full">
      <ConversationsList />
      <div className='bg-[#ffffff78] py-5 px-4 rounded-[12px] w-[calc(100%-280px)] h-[calc(100vh-93px)]'>{children}</div>
    </main>
  );
}
