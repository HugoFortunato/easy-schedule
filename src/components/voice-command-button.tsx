"use client";

import { useState } from "react";
import { Mic, Loader2 } from "lucide-react";
import { useVoiceCommands, VoiceCommand } from "@/hooks/use-voice-commands";
import { cn } from "@/lib/utils";

interface VoiceCommandButtonProps {
  onCommand: (command: VoiceCommand) => void;
  className?: string;
}

export default function VoiceCommandButton({
  onCommand,
  className,
}: VoiceCommandButtonProps) {
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
  } = useVoiceCommands({
    onCommand: (command) => {
      onCommand(command);

      setTimeout(() => setFeedback(null), 3000);
    },
    onError: (error) => {
      setFeedback({ message: error, type: "error" });
      setTimeout(() => setFeedback(null), 3000);
    },
  });

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all border",
          isListening
            ? "bg-red-500 text-white border-red-500 hover:bg-red-600 animate-pulse"
            : "hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-gray-300 hover:border-gray-400",
          className
        )}
        title={isListening ? "Parar de ouvir" : "Comando de voz"}
      >
        {isListening ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm hidden sm:inline">Ouvindo...</span>
          </>
        ) : (
          <>
            <Mic className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Voz</span>
          </>
        )}
      </button>

      {isListening && transcript && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs z-50">
          <p className="italic">{transcript}</p>
        </div>
      )}
      {feedback && !isListening && (
        <div
          className={cn(
            "absolute top-full mt-2 right-0 text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs z-50",
            feedback.type === "success" && "bg-green-500 text-white",
            feedback.type === "error" && "bg-red-500 text-white",
            feedback.type === "info" && "bg-blue-500 text-white"
          )}
        >
          <p>{feedback.message}</p>
        </div>
      )}
    </div>
  );
}
