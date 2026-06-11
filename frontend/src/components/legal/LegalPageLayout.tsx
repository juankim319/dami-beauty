interface Props {
  title: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-dami-900 md:text-3xl">{title}</h1>
      <div className="prose prose-sm mt-8 max-w-none text-dami-700 prose-headings:text-dami-800 prose-a:text-dami-500">
        {children}
      </div>
    </div>
  );
}
