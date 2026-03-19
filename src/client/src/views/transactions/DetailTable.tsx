import { ReactNode } from 'react';

interface DetailRowProps {
  label: string;
  children: ReactNode;
}

export const DetailRow = ({ label, children }: DetailRowProps) => {
  if (!children) return null;
  return (
    <tr className="even:bg-muted/30">
      <td className="py-1.5 px-2 pr-4 text-muted-foreground whitespace-nowrap align-top">
        {label}
      </td>
      <td className="py-1.5 px-2 text-right break-all align-top [&_.flex]:justify-end">
        {children}
      </td>
    </tr>
  );
};

export const DetailTable = ({ children }: { children: ReactNode }) => (
  <table className="w-full text-xs">
    <tbody>{children}</tbody>
  </table>
);
