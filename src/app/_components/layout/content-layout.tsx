

interface ContentLayoutProps {
  children: React.ReactNode;
}

async function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div>
      <div className=" min-h-screen  flex">{children}</div>
    </div>
  );
}

export default ContentLayout