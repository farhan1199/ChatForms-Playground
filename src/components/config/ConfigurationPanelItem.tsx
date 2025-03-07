import { ReactNode } from "react";
import { PlaygroundDeviceSelector } from "@/components/playground/PlaygroundDeviceSelector";
import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";

type ConfigurationPanelItemProps = {
  title: string;
  children?: ReactNode;
  deviceSelectorKind?: MediaDeviceKind;
};

export const ConfigurationPanelItem: React.FC<ConfigurationPanelItemProps> = ({
  children,
  title,
  deviceSelectorKind,
}) => {
  return (
    <div className="w-full text-gray-700 py-4 border-b border-b-gray-200 relative">
      <div className="flex flex-row justify-between items-center px-4 text-xs uppercase tracking-wider font-medium">
        <h3 className="text-[#4D2583]">{title}</h3>
        {deviceSelectorKind && (
          <span className="flex flex-row gap-2">
            <TrackToggle
              className="px-2 py-1 bg-white text-gray-700 border border-gray-200 rounded-sm hover:bg-gray-50"
              source={
                deviceSelectorKind === "audioinput"
                  ? Track.Source.Microphone
                  : Track.Source.Camera
              }
            />
            <PlaygroundDeviceSelector kind={deviceSelectorKind} />
          </span>
        )}
      </div>
      <div className="px-4 py-2 text-xs text-gray-600 leading-normal">
        {children}
      </div>
    </div>
  );
};
