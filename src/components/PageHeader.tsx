export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-faint">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h1>
      {children && (
        <div className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {children}
        </div>
      )}
    </header>
  );
}
