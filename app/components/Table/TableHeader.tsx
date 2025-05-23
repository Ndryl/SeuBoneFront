interface TableHeaderProps {
  columns?: string[];
}

export default function TableHeader({ columns }: TableHeaderProps) {
  const column = columns ?? ["Título", "SKU", "Tipo", "Ordem", "Status"];

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_0.8fr] bg-[#F2F2F7] py-3">
      {column.map((col, index) => (
        <h1
          key={index}
          className="text-sm font-semibold text-[#8E8E93] text-center"
        >
          {col}
        </h1>
      ))}
    </div>
  );
}
