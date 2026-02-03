"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: ISpeechRecognitionResultList;
}

interface ISpeechRecognitionResultList {
  [index: number]: ISpeechRecognitionResult;
  length: number;
}

interface ISpeechRecognitionResult {
  [index: number]: ISpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface ISpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognitionErrorEvent {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export interface VoiceCommand {
  action:
    | "excluir"
    | "filtrar"
    | "limpar"
    | "desconhecido"
    | "ir para"
    | "ontem";
  target?: string;
  date?: string;
  time?: string;
  rawText: string;
}

interface UseVoiceCommandsOptions {
  onCommand?: (command: VoiceCommand) => void;
  onError?: (error: string) => void;
  onTranscript?: (transcript: string) => void;
}

export function useVoiceCommands(options: UseVoiceCommandsOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "pt-BR";
    }
  }, []);

  const parseCommand = useCallback((text: string): VoiceCommand => {
    const lowerText = text.toLowerCase().trim();

    let action: VoiceCommand["action"] = "desconhecido";

    if (
      lowerText.includes("excluir") ||
      lowerText.includes("apagar") ||
      lowerText.includes("deletar") ||
      lowerText.includes("remover")
    ) {
      action = "excluir";
    } else if (
      lowerText.includes("filtrar") ||
      lowerText.includes("mostrar") ||
      lowerText.includes("buscar") ||
      lowerText.includes("procurar")
    ) {
      action = "filtrar";
    } else if (
      lowerText.includes("limpar") ||
      lowerText.includes("resetar") ||
      lowerText.includes("todos")
    ) {
      action = "limpar";
    } else if (
      lowerText.includes("ir para") ||
      lowerText.includes("mostrar") ||
      lowerText.includes("buscar") ||
      lowerText.includes("procurar")
    ) {
      action = "ir para";
    } else if (lowerText.includes("ontem")) {
      action = "ontem";
    }
    const timeMatch = lowerText.match(
      /(\d{1,2})\s*(hora|horas|h|:00|:30)?|às\s*(\d{1,2})/
    );
    const time = timeMatch ? timeMatch[1] || timeMatch[3] : undefined;

    let date: string | undefined;
    if (lowerText.includes("hoje")) {
      date = "hoje";
    } else if (lowerText.includes("amanhã")) {
      date = "amanhã";
    } else if (lowerText.includes("ir para")) {
      date = lowerText.split("ir para")[1].trim();
    }

    const nameMatch = lowerText.match(
      /(?:do|da|de|cliente)\s+([a-záàâãéèêíïóôõöúçñ]+)/i
    );
    const target = nameMatch ? nameMatch[1] : undefined;

    return {
      action,
      target,
      date,
      time: time ? `${time.padStart(2, "0")}:00` : undefined,
      rawText: text,
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      options.onError?.("Reconhecimento de voz não suportado neste navegador");
      return;
    }

    setTranscript("");
    setIsListening(true);

    recognitionRef.current.onresult = (event) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript;

      setTranscript(transcriptText);
      options.onTranscript?.(transcriptText);

      if (result.isFinal) {
        const command = parseCommand(transcriptText);
        options.onCommand?.(command);
        setIsListening(false);
      }
    };

    recognitionRef.current.onerror = (event) => {
      toast.error("Erro ao reconhecer voz");
      options.onError?.(`Erro: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
    }
  }, [isSupported, options, parseCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
  };
}
