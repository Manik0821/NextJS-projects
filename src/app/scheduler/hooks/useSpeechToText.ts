"use client";

import { useEffect, useRef, useState } from "react";

type SpeechRecognitionType = typeof window extends never
  ? never
  : any;

interface UseSpeechToTextOptions {
  onText?: (text: string) => void;
  append?: boolean;
}

export function useSpeechToText({
  onText,
  append = true,
}: UseSpeechToTextOptions = {}) {
  const recognitionRef =
    useRef<SpeechRecognitionType | null>(null);

  const [isSupported, setIsSupported] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as SpeechRecognitionType)
        .SpeechRecognition ||
      (window as SpeechRecognitionType)
        .webkitSpeechRecognition;


    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(event.error ?? "Speech recognition failed.");
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0]?.transcript)
        .filter(Boolean)
        .join(" ")
        .trim();

      if (transcript && onText) {
        onText(transcript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [onText, append]);

  function startListening() {
    if (!recognitionRef.current || isListening) return;

    setError(null);
    recognitionRef.current.start();
  }

  function stopListening() {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);
  }

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  return {
    isSupported,
    isListening,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}