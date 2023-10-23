interface TableHeadProps {
  columns: Array<{ column: string; icon: JSX.Element }>;
}

export const TableHead = ({ columns }: TableHeadProps) => {
  const columnStyle = (index: number) => {
    if (index === 0) {
      return "rounded-l-lg";
    } else if (index === columns.length - 1) {
      return "rounded-r-lg";
    } else {
      return "";
    }
  };

  return (
    <div className="bg-m-light-purple table-header-group">
      <div className="table-row">
        {columns.map(({ column, icon }, index) => (
          <div
            key={index}
            className={`table-cell ${columnStyle(
              index,
            )} py-4 text-center text-xs font-bold sm:text-sm md:text-base`}
          >
            <div className="flex justify-center">{icon}</div>
            {column}
          </div>
        ))}
      </div>
    </div>
  );
};
