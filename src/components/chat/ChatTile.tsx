import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatMessageInput } from "@/components/chat/ChatMessageInput";
import { ChatMessage as ComponentsChatMessage } from "@livekit/components-react";
import { useEffect, useRef, useState } from "react";

const inputHeight = 48;

export type ChatMessageType = {
  name: string;
  message: string;
  isSelf: boolean;
  timestamp: number;
  id?: string;
  sender?: string;
  text?: string;
  suggestions?: string[];
  type?: string;
  popupType?: "confirm_donation" | "verify_information";
  params?: {
    title?: string;
    message?: string;
    form_data?: Record<string, any>;
    [key: string]: any;
  };
};

type ChatTileProps = {
  messages: ChatMessageType[];
  accentColor: string;
  onSend?: (message: string) => Promise<ComponentsChatMessage | null>;
};

export const ChatTile = ({ messages, accentColor, onSend }: ChatTileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [popupResponded, setPopupResponded] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef, messages]);

  useEffect(() => {
    setPopupResponded(false);
  }, [messages.length]);

  const processedMessages = messages.map((msg) => {
    const processedMsg = { ...msg };

    if (!processedMsg.name) {
      processedMsg.name = processedMsg.id
        ? processedMsg.id.split("-")[0]
        : processedMsg.sender === "agent"
        ? "Assistant"
        : "You";
    }

    if (!processedMsg.message) {
      processedMsg.message = processedMsg.text || "";
    }

    if (processedMsg.isSelf === undefined) {
      processedMsg.isSelf = processedMsg.sender !== "agent";
    }

    if (!processedMsg.timestamp) {
      processedMsg.timestamp = new Date().getTime();
    }

    return processedMsg;
  });

  const handleSuggestionClick = (suggestion: string) => {
    setPopupResponded(true);

    if (onSend) {
      onSend(suggestion);
    }
  };

  const latestMessage =
    processedMessages.length > 0
      ? processedMessages[processedMessages.length - 1]
      : null;

  const hasActivePopup =
    !popupResponded &&
    latestMessage !== null &&
    latestMessage.type === "showPopup" &&
    latestMessage.popupType &&
    !latestMessage.isSelf;

  return (
    <div className="flex flex-col gap-4 w-full h-full bg-white">
      <div
        ref={containerRef}
        className="overflow-y-auto px-4"
        style={{
          height: `calc(100% - ${inputHeight}px)`,
        }}
      >
        <div className="flex flex-col min-h-full justify-end">
          {processedMessages.map((message, index, allMsg) => {
            const hideName =
              index >= 1 && allMsg[index - 1].name === message.name;

            const isLatestMessage = index === processedMessages.length - 1;
            const showPopup =
              isLatestMessage &&
              !popupResponded &&
              message.type === "showPopup" &&
              message.popupType &&
              !message.isSelf;

            return (
              <ChatMessage
                key={index}
                hideName={hideName}
                name={message.name}
                message={message.message}
                isSelf={message.isSelf}
                accentColor={accentColor}
                suggestions={message.suggestions}
                onSuggestionClick={handleSuggestionClick}
                type={showPopup ? message.type : undefined}
                popupType={showPopup ? message.popupType : undefined}
                params={showPopup ? message.params : undefined}
              />
            );
          })}
        </div>
      </div>
      <ChatMessageInput
        height={inputHeight}
        placeholder={
          hasActivePopup
            ? "Please respond to the popup above"
            : "Type a message"
        }
        accentColor={accentColor}
        onSend={onSend}
        disabled={hasActivePopup}
      />
    </div>
  );
};
