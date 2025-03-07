import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatMessageInput } from "@/components/chat/ChatMessageInput";
import { ChatMessage as ComponentsChatMessage } from "@livekit/components-react";
import { useEffect, useRef } from "react";

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
};

type ChatTileProps = {
  messages: ChatMessageType[];
  accentColor: string;
  onSend?: (message: string) => Promise<ComponentsChatMessage | null>;
};

export const ChatTile = ({ messages, accentColor, onSend }: ChatTileProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef, messages]);

  const processedMessages = messages.map((msg) => {
    console.log("Processing message in ChatTile:", msg);
    console.log("Original suggestions:", msg.suggestions);

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

    console.log(
      "Processed message with suggestions:",
      processedMsg.suggestions
    );
    return processedMsg;
  });

  console.log("All processed messages:", processedMessages);

  const handleSuggestionClick = (suggestion: string) => {
    if (onSend) {
      onSend(suggestion);
    }
  };

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
              />
            );
          })}
        </div>
      </div>
      <ChatMessageInput
        height={inputHeight}
        placeholder="Type a message"
        accentColor={accentColor}
        onSend={onSend}
      />
    </div>
  );
};
