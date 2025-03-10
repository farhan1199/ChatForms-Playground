type ChatMessageProps = {
  message: string;
  accentColor: string;
  name: string;
  isSelf: boolean;
  hideName?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  type?: string;
  popupType?: "confirm_donation" | "verify_information";
  params?: {
    title?: string;
    message?: string;
    form_data?: Record<string, any>;
    [key: string]: any;
  };
};

export const ChatMessage = ({
  name,
  message,
  accentColor,
  isSelf,
  hideName,
  suggestions = [],
  onSuggestionClick,
  type,
  popupType,
  params,
}: ChatMessageProps) => {
  // Check if suggestions exist and have length
  const hasSuggestions = Array.isArray(suggestions) && suggestions.length > 0;

  // Check if this is a popup message
  const isPopup = type === "showPopup" && popupType && params;

  // Render form data for verify_information popup
  const renderFormData = () => {
    if (!params?.form_data) return null;

    return (
      <div className="mt-2 bg-white p-3 rounded-md border border-gray-200">
        {Object.entries(params.form_data).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between py-1 border-b border-gray-100 last:border-0"
          >
            <span className="font-medium text-gray-700">
              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
            <span className="text-gray-900">
              {typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : value.toString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

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

      {/* Popup Content */}
      {isPopup && (
        <div className="mt-3 bg-[#F5F0FF] p-4 rounded-md border border-[#4D2583] shadow-sm">
          {params.title && (
            <h3 className="font-bold text-[#4D2583] mb-2">{params.title}</h3>
          )}
          {params.message && (
            <p className="text-gray-700 mb-3">{params.message}</p>
          )}

          {/* Render form data for verify_information popup */}
          {popupType === "verify_information" && renderFormData()}

          {/* Popup Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() =>
                  onSuggestionClick && onSuggestionClick(suggestion)
                }
                className="bg-white border border-[#4D2583] text-[#4D2583] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#F5F0FF] transition-colors shadow-sm hover:shadow active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Regular Suggestions (only show if not a popup) */}
      {!isSelf && hasSuggestions && !isPopup && (
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
