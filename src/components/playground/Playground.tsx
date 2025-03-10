"use client";

import { LoadingSVG } from "@/components/button/LoadingSVG";
import { ChatMessageType } from "@/components/chat/ChatTile";
import { AudioInputTile } from "@/components/config/AudioInputTile";
import { ConfigurationPanelItem } from "@/components/config/ConfigurationPanelItem";
import { NameValueRow } from "@/components/config/NameValueRow";
import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import {
  PlaygroundTab,
  PlaygroundTabbedTile,
  PlaygroundTile,
} from "@/components/playground/PlaygroundTile";
import { useConfig } from "@/hooks/useConfig";
import {
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useRoomInfo,
  useTracks,
  useVoiceAssistant,
  useChat,
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import tailwindTheme from "../../lib/tailwindTheme.preval";
import { ChatTile } from "@/components/chat/ChatTile";

export interface PlaygroundMeta {
  name: string;
  value: string;
}

export interface PlaygroundProps {
  logo?: ReactNode;
  themeColors: string[];
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
}

const headerHeight = 56;

export default function Playground({
  logo,
  themeColors,
  onConnect,
}: PlaygroundProps) {
  const { config, setUserSettings } = useConfig();
  const { name } = useRoomInfo();
  const [transcripts, setTranscripts] = useState<ChatMessageType[]>([]);
  const { localParticipant } = useLocalParticipant();

  const { send: sendChat } = useChat();

  const voiceAssistant = useVoiceAssistant();

  const roomState = useConnectionState();
  const tracks = useTracks();

  const [selectedSuggestion, setSelectedSuggestion] = useState(false);

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setCameraEnabled(config.settings.inputs.camera);
      localParticipant.setMicrophoneEnabled(config.settings.inputs.mic);
    }
  }, [config, localParticipant, roomState]);

  // Reset messages when disconnected
  useEffect(() => {
    if (roomState === ConnectionState.Disconnected) {
      setTranscripts([]);
      setSelectedSuggestion(false);
    }
  }, [roomState]);

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  const onDataReceived = useCallback(
    (msg: any) => {
      if (msg.topic === "transcription" || msg.topic === "lk-chat-topic") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );

        console.log("decoded message:", decoded);

        // Process the message based on the format
        const newMessage: ChatMessageType = {
          // Use the id as the name (first part before the dash)
          name: decoded.id ? decoded.id.split("-")[0] : "unknown",
          message: decoded.message || decoded.text || "",
          timestamp: decoded.timestamp || new Date().getTime(),
          isSelf: decoded.sender !== "agent", // Messages from agent are not "self"
          id: decoded.id,
          sender: decoded.sender,
          suggestions: decoded.suggestions || [], // Add suggestions
          // Add popup-related fields if present
          type: decoded.type,
          popupType: decoded.popupType,
          params: decoded.params,
        };

        // For agent messages, set a more friendly name
        if (decoded.sender === "agent") {
          newMessage.name = "Agent";

          // Reset selectedSuggestion when a new agent message arrives
          setSelectedSuggestion(false);
        }

        setTranscripts((prev) => [...prev, newMessage]);
      } else {
        //decode and log
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );
        console.log("decoded message other:", decoded);
      }
    },
    [transcripts, setSelectedSuggestion]
  );

  useDataChannel(onDataReceived);

  useEffect(() => {
    document.body.style.setProperty(
      "--lk-theme-color",
      // @ts-ignore
      tailwindTheme.colors[config.settings.theme_color]["500"]
    );
    document.body.style.setProperty(
      "--lk-drop-shadow",
      `var(--lk-theme-color) 0px 0px 18px`
    );
  }, [config.settings.theme_color]);

  const chatTileContent = useMemo(() => {
    // Find the index of the latest agent message
    const latestAgentMessageIndex = [...transcripts]
      .reverse()
      .findIndex((msg) => msg.sender === "agent");
    // Calculate the actual index in the original array (if found)
    const latestAgentIndex =
      latestAgentMessageIndex !== -1
        ? transcripts.length - 1 - latestAgentMessageIndex
        : -1;

    return (
      <ChatTile
        messages={transcripts.map((msg, index) => ({
          name: msg.sender === "agent" ? "Agent" : "You",
          message: (msg.message || msg.text || "").toString(),
          isSelf: msg.sender !== "agent",
          timestamp: msg.timestamp || new Date().getTime(),
          // Only include suggestions for the latest agent message and only if no suggestion has been selected
          suggestions:
            !selectedSuggestion &&
            msg.sender === "agent" &&
            index === latestAgentIndex
              ? msg.suggestions || []
              : [],
          // Pass popup properties
          type: msg.type,
          popupType: msg.popupType,
          params: msg.params,
        }))}
        accentColor={config.settings.theme_color}
        onSend={async (message) => {
          if (message.trim()) {
            try {
              // Set selectedSuggestion to true when a message is sent
              setSelectedSuggestion(true);

              await sendChat(message);
              console.log("Message sent:", message);

              const newMessage = {
                name: "You",
                message: message,
                timestamp: new Date().getTime(),
                isSelf: true,
                sender: "member",
              };
              setTranscripts((prev) => [...prev, newMessage]);

              return null;
            } catch (error) {
              console.error("Error sending message:", error);
            }
          }
          return null;
        }}
      />
    );
  }, [config.settings.theme_color, transcripts, sendChat, selectedSuggestion]);

  // Reset selectedSuggestion when a new agent message is received
  useEffect(() => {
    const lastMessage = transcripts[transcripts.length - 1];
    if (lastMessage && lastMessage.sender === "agent") {
      setSelectedSuggestion(false);
    }
  }, [transcripts]);

  const settingsTileContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 h-full w-full items-start overflow-y-auto">
        {config.description && (
          <ConfigurationPanelItem title="Description">
            {config.description}
          </ConfigurationPanelItem>
        )}

        <ConfigurationPanelItem title="Settings">
          {localParticipant && (
            <div className="flex flex-col gap-2">
              <NameValueRow name="Room" value={name} valueColor="[#4D2583]" />
              <NameValueRow
                name="Participant"
                value={localParticipant.identity}
              />
            </div>
          )}
        </ConfigurationPanelItem>
        <ConfigurationPanelItem title="Status">
          <div className="flex flex-col gap-2">
            <NameValueRow
              name="Room connected"
              value={
                roomState === ConnectionState.Connecting ? (
                  <LoadingSVG diameter={16} strokeWidth={2} />
                ) : (
                  roomState.toUpperCase()
                )
              }
              valueColor={
                roomState === ConnectionState.Connected
                  ? "[#4D2583]"
                  : "gray-500"
              }
            />
            <NameValueRow
              name="Agent connected"
              value={
                voiceAssistant.agent ? (
                  "TRUE"
                ) : roomState === ConnectionState.Connected ? (
                  <LoadingSVG diameter={12} strokeWidth={2} />
                ) : (
                  "FALSE"
                )
              }
              valueColor={voiceAssistant.agent ? "[#4D2583]" : "gray-500"}
            />
          </div>
        </ConfigurationPanelItem>
        {/* renders the audio input bars */}
        {localMicTrack && (
          <ConfigurationPanelItem
            title="Microphone"
            deviceSelectorKind="audioinput"
          >
            <AudioInputTile trackRef={localMicTrack} />
          </ConfigurationPanelItem>
        )}
      </div>
    );
  }, [
    config.description,
    config.settings,
    config.show_qr,
    localParticipant,
    name,
    roomState,
    localMicTrack,
    themeColors,
    setUserSettings,
    voiceAssistant.agent,
  ]);

  let mobileTabs: PlaygroundTab[] = [];

  if (config.settings.chat && roomState === ConnectionState.Connected) {
    mobileTabs.push({
      title: "Chat",
      content: chatTileContent,
    });
  }

  mobileTabs.push({
    title: "Settings",
    content: (
      <PlaygroundTile
        padding={false}
        backgroundColor="[#F7F6F5]"
        className="h-full w-full basis-1/4 items-start overflow-y-auto"
        childrenClassName="h-full grow items-start"
      >
        {settingsTileContent}
      </PlaygroundTile>
    ),
  });

  return (
    <>
      <PlaygroundHeader
        title={config.title}
        logo={logo}
        githubLink={config.github_link}
        height={headerHeight}
        accentColor={config.settings.theme_color}
        connectionState={roomState}
        onConnectClicked={() => {
          if (roomState === ConnectionState.Connected) {
            setTranscripts([]);
          }
          onConnect(roomState === ConnectionState.Disconnected);
        }}
      />
      <div
        className="flex gap-4 py-4 grow w-full"
        style={{ height: `calc(100% - ${headerHeight}px)` }}
      >
        {/* Mobile View */}
        <div className="flex flex-col grow basis-1/2 gap-4 h-full lg:hidden">
          {roomState === ConnectionState.Connected ? (
            // Show Tabs when connected
            <PlaygroundTabbedTile
              className="h-full shadow-md"
              tabs={mobileTabs}
              initialTab={mobileTabs.length - 1}
            />
          ) : (
            // Show Welcome Screen when not connected
            <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-md shadow-md border border-gray-200 p-4">
              <div className="font-bold text-3xl tracking-tight bg-gradient-to-r from-[#4D2583] to-[#6A35B8] text-transparent bg-clip-text mb-3 text-center">
                Welcome to 1199SEIU
              </div>
              <p className="text-gray-600 text-base mb-6 text-center">
                Connect with our virtual assistant to get help with your forms
                and questions.
              </p>
              <button
                onClick={() => {
                  setTranscripts([]);
                  onConnect(true);
                }}
                className="bg-gradient-to-r from-[#4D2583] to-[#6A35B8] text-white px-6 py-2 rounded-md text-base font-medium shadow-md hover:shadow-lg transition-all"
              >
                Let's Get Started
              </button>
            </div>
          )}
        </div>

        {/* Desktop View - Show either Welcome Screen or Chat based on connection state */}
        <div className="h-full grow basis-3/4 hidden lg:flex">
          {roomState === ConnectionState.Connected ? (
            // Show Chat when connected
            config.settings.chat && (
              <PlaygroundTile title="Chat" className="h-full w-full shadow-md">
                {chatTileContent}
              </PlaygroundTile>
            )
          ) : (
            // Show Welcome Screen when not connected
            <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-md shadow-md border border-gray-200 p-8">
              <div className="font-bold text-4xl tracking-tight bg-gradient-to-r from-[#4D2583] to-[#6A35B8] text-transparent bg-clip-text mb-4">
                Welcome to 1199SEIU
              </div>
              <p className="text-gray-600 text-lg mb-8 text-center max-w-lg">
                Connect with our virtual assistant to get help with your forms
                and questions.
              </p>
              <button
                onClick={() => {
                  setTranscripts([]);
                  onConnect(true);
                }}
                className="bg-gradient-to-r from-[#4D2583] to-[#6A35B8] text-white px-8 py-3 rounded-md text-lg font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                Let's Get Started
              </button>
            </div>
          )}
        </div>

        {/* Desktop Settings */}
        <PlaygroundTile
          padding={false}
          backgroundColor="[#F7F6F5]"
          className="h-full w-full basis-1/4 items-start overflow-y-auto hidden max-w-[480px] lg:flex shadow-md"
          childrenClassName="h-full grow items-start"
        >
          {settingsTileContent}
        </PlaygroundTile>
      </div>
    </>
  );
}
