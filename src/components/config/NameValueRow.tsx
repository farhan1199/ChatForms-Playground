import { ReactNode } from "react";

type NameValueRowProps = {
  name: string;
  value?: ReactNode;
  valueColor?: string;
};

export const NameValueRow: React.FC<NameValueRowProps> = ({
  name,
  value,
  valueColor = "gray-600",
}) => {
  return (
    <div className="flex flex-row w-full items-baseline text-sm">
      <div className="grow shrink-0 text-gray-600">{name}</div>
      <div
        className={`text-xs shrink text-${valueColor} text-right font-medium`}
      >
        {value}
      </div>
    </div>
  );
};
