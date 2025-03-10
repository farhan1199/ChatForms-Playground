type ChatMessageProps = {
  message: string;
  accentColor: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
};

export const ChatMessage = ({
  name,
  message,
  accentColor,
  isSelf,
  hideName,
  suggestions = [],
  onSuggestionClick,
}: ChatMessageProps) => {
  // Check if suggestions exist and have length
  const hasSuggestions = Array.isArray(suggestions) && suggestions.length > 0;

  return (
    <div className={`flex flex-col gap-1 ${hideName ? "pt-0" : "pt-6"} mb-4`}>
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

      {/* Suggestions */}
      {!isSelf && hasSuggestions && (
        <div className="flex flex-wrap gap-2 mt-3 ml-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick && onSuggestionClick(suggestion)}
              className="bg-white border border-[#4D2583] text-[#4D2583] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#F5F0FF] transition-colors shadow-sm hover:shadow active:scale-95"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
