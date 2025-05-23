interface TableRowProps {
  data: (string | number)[];
}

export function TableRow({ data }: TableRowProps) {
  return (
    <div className="grid grid-cols-5 py-3 border-b">
      {data.map((value, index) => (
        <div key={index} className="text-center text-sm text-[#1C1C1E]">
          {value}
        </div>
      ))}
    </div>
  );
}
