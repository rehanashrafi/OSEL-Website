export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: string;
}) {
  return (
    <p className="text-label flex items-center gap-4 text-subdued">
      <span className="text-brand">{number}</span>
      <span aria-hidden="true" className="h-px w-8 bg-line" />
      {children}
    </p>
  );
}
