const speech = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const App = () => {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";

  const startListening = () => {
    recognition.start();
    recognition.onresult = async (event) => {
      const userSpeech = event.results[0][0].transcript;
      speakText("Let me think...");
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userSpeech }),
      });

      const data = await res.json();
      speakText(data.reply);
    };
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speech.speak(utterance);
  };

  return (
    <div>
      <h2>🎤 Voice Interview Bot</h2>
      <button onclick="startListening()">Start Listening</button>
    </div>
  );
};

App();
