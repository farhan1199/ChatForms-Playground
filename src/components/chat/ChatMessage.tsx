type ChatMessageProps = {
  message: string;
  accentColor: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
};

export const ChatMessage = ({
  name,
  message,
  accentColor,
  isSelf,
  hideName,
}: ChatMessageProps) => {
  return (
    <div className={`flex flex-col gap-1 ${hideName ? "pt-0" : "pt-6"}`}>
      {!hideName && (
        <div
          className={`text-${
            isSelf ? "gray-600" : "[#4D2583]"
          } uppercase text-xs font-medium`}
        >
          {name}
        </div>
      )}
      <div
        className={`pr-4 text-${
          isSelf ? "gray-600" : "gray-700"
        } text-sm whitespace-pre-line ${
          isSelf
            ? "bg-gray-50 p-2 rounded-md"
            : `bg-[#F5F0FF] p-2 rounded-md border-l-2 border-[#4D2583]`
        }`}
      >
        {message}
      </div>
    </div>
  );
};
