'use client';
import { useState } from 'react';

export default function VoicePlayer({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.8;
      speech.pitch = 1;
      
      speech.onstart = () => setIsPlaying(true);
      speech.onend = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(speech);
    } else {
      alert('Text-to-speech not supported in your browser');
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <button
      onClick={isPlaying ? stopSpeaking : speakText}
      className={`flex items-center gap-2 px-4 py-2 rounded ${
        isPlaying ? 'bg-red-500' : 'bg-green-500'
      } text-white`}
    >
      {isPlaying ? '🔊 Stop' : '🔈 Read Aloud'}
    </button>
  );
}