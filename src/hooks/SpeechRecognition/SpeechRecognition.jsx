import { useEffect } from 'react';

export function useSpeechRecognition(onResult) {
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Seu navegador não suporta reconhecimento de voz.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.onerror = (err) => console.error('Erro de voz:', err);

    recognition.start();

    return () => recognition.stop();
  }, [onResult]);
}
