import { ReactNode, useState } from "react";

const titleHeight = 32;

type PlaygroundTileProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
  childrenClassName?: string;
  padding?: boolean;
  backgroundColor?: string;
};

export type PlaygroundTab = {
  title: string;
  content: ReactNode;
};

export type PlaygroundTabbedTileProps = {
  tabs: PlaygroundTab[];
  initialTab?: number;
} & PlaygroundTileProps;

export const PlaygroundTile: React.FC<PlaygroundTileProps> = ({
  children,
  title,
  className,
  childrenClassName,
  padding = true,
  backgroundColor = "white",
}) => {
  const contentPadding = padding ? 4 : 0;
  return (
    <div
      className={`flex flex-col border rounded-md border-gray-200 text-gray-700 bg-${backgroundColor} shadow-sm ${className}`}
    >
      {title && (
        <div
          className="flex items-center justify-center text-xs uppercase py-2 border-b border-b-gray-200 tracking-wider bg-white"
          style={{
            height: `${titleHeight}px`,
          }}
        >
          <h2 className="font-medium">{title}</h2>
        </div>
      )}
      <div
        className={`flex flex-col items-center grow w-full ${childrenClassName}`}
        style={{
          height: `calc(100% - ${title ? titleHeight + "px" : "0px"})`,
          padding: `${contentPadding * 4}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const PlaygroundTabbedTile: React.FC<PlaygroundTabbedTileProps> = ({
  tabs,
  initialTab = 0,
  className,
  childrenClassName,
  backgroundColor = "white",
}) => {
  const contentPadding = 4;
  const [activeTab, setActiveTab] = useState(initialTab);
  if (activeTab >= tabs.length) {
    return null;
  }
  return (
    <div
      className={`flex flex-col h-full border rounded-md border-gray-200 text-gray-700 bg-${backgroundColor} shadow-sm ${className}`}
    >
      <div
        className="flex items-center justify-start text-xs uppercase border-b border-b-gray-200 tracking-wider bg-white"
        style={{
          height: `${titleHeight}px`,
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-t-md hover:bg-gray-100 hover:text-gray-700 border-r border-r-gray-200 ${
              index === activeTab
                ? `bg-[#F7F6F5] text-[#4D2583] font-medium`
                : `bg-transparent text-gray-500`
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div
        className={`w-full ${childrenClassName}`}
        style={{
          height: `calc(100% - ${titleHeight}px)`,
          padding: `${contentPadding * 4}px`,
        }}
      >
        {tabs[activeTab].content}
      </div>
    </div>
  );
};
