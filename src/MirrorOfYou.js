// MirrorOfYou.js
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
const Card = ({ children, className = '', ...props }) => (
  <div
    className={`backdrop-blur-md bg-white/30 border border-white/40 rounded-2xl p-5 mt-5 shadow-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);
const Button = ({ children, className = '', ...props }) => (
  <button style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', margin: '6px 0', cursor: 'pointer' }} className={className} {...props}>
    {children}
  </button>
);


const MirrorOfYou = () => {
  const [name, setName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [reflection, setReflection] = useState("");
  const [themes, setThemes] = useState([]);
console.log(themes);
  const [promptIndex, setPromptIndex] = useState(0);
  const [noThemeDetected, setNoThemeDetected] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showInputError, setShowInputError] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [promptIndex]);

  const prompts = [
    "What’s something you’re naturally good at?",
    "Describe a time you felt proud of how you handled something.",
    "What do people often come to you for?",
    "When do you feel most alive or in flow?"
  ];

  const detectThemes = (answers) => {
    const themes = {
      creativity: 0,
      empathy: 0,
      leadership: 0,
      resilience: 0,
      strategy: 0,
      collaboration: 0,
      selfAwareness: 0,
    };

    answers.forEach((answer) => {
      const text = answer.toLowerCase();
      if (text.includes("imagine") || text.includes("create")) themes.creativity++;
      if (text.includes("help") || text.includes("feel")) themes.empathy++;
      if (text.includes("lead") || text.includes("guide")) themes.leadership++;
      if (text.includes("overcome") || text.includes("persist")) themes.resilience++;
      if (text.includes("plan") || text.includes("analyze")) themes.strategy++;
      if (text.includes("team") || text.includes("collaborate")) themes.collaboration++;
      if (text.includes("aware") || text.includes("reflect")) themes.selfAwareness++;
    });

    return Object.entries(themes)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, count]) => count > 0)
      .map(([theme]) => theme);
  };

  const reflections = {
    creativity: "You shine as a creator—your ideas break barriers and inspire others to see things in a new light.",
    empathy: "You hold space for others with deep compassion—your heart is a safe haven for those in need.",
    leadership: "You naturally guide and inspire—your presence uplifts others and drives purpose forward.",
    resilience: "You’ve walked through fire and come out stronger—your strength lies in your ability to rise.",
    strategy: "Your mind is always moving a few steps ahead—your insight turns complexity into clarity.",
    collaboration: "You bring people together—your energy fuels synergy and shared success.",
    selfAwareness: "You’ve done the inner work—your growth mindset is a light for yourself and others.",
  };

  const generateReflection = (theme) =>
    reflections[theme] || "You bring something unique—your journey reflects untapped potential.";

  const handleAnswersSubmit = () => {
    const detectedThemes = detectThemes(answers);
    setThemes(detectedThemes);

    if (detectedThemes.length === 0) {
      setNoThemeDetected(true);
      setAnswers([]);
      setPromptIndex(0);
      setReflection(
        "We couldn’t detect a clear strength theme from your responses. Let’s try again with some inspiration."
      );
    } else {
      setNoThemeDetected(false);
      const mainTheme = detectedThemes[0];
      const reflectionText = generateReflection(mainTheme);
      setReflection(reflectionText);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const handleAddAnswer = () => {
    if (currentAnswer.trim() === "") {
      setShowInputError(true);
      return;
    }
    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer("");
    setPromptIndex((prev) => prev + 1);
    setShowInputError(false);
  };

  const handleReset = () => {
    setName("");
    setAnswers([]);
    setCurrentAnswer("");
    setReflection("");
    setThemes([]);
    setPromptIndex(0);
    setNoThemeDetected(false);
    setShowConfetti(false);
    setShowInputError(false);
  };

  const handleCopyReflection = () => {
    navigator.clipboard.writeText(`${name ? name + ", " : ""}${reflection}`);
    alert("Reflection copied to clipboard!");
  };
return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 p-6 relative overflow-hidden font-sans">
    <h1 style={{ color: '#4f46e5', fontSize: '28px', textAlign: 'center', marginBottom: '20px' }}>
      Mirror of You
    </h1>

    {showConfetti && <Confetti recycle={false} numberOfPieces={250} />}

    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>

      {/* Name Input Section */}
      {!isStarted && (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What’s your name?"
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '12px',
              border: '1px solid #ccc',
            }}
          />
          {name.trim() !== "" && (
            <Button onClick={() => setIsStarted(true)}>
              Continue
            </Button>
          )}
        </>
      )}

      {/* Prompts Section */}
      {isStarted && promptIndex < prompts.length && (
        <>
          <AnimatePresence mode="wait">
            <motion.p
              key={promptIndex}
              style={{
                fontStyle: 'italic',
                marginBottom: '10px',
                fontSize: '18px',
                color: '#333',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {prompts[promptIndex]}
            </motion.p>
          </AnimatePresence>

          <input
            ref={inputRef}
            type="text"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type something meaningful..."
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '12px',
              border: showInputError ? '2px solid red' : '1px solid #ccc',
            }}
          />
          {showInputError && (
            <p style={{ color: 'red', fontSize: '14px', marginBottom: '8px' }}>
              Please enter something before continuing.
            </p>
          )}
          {currentAnswer.trim() !== "" && (
            <Button onClick={handleAddAnswer}>Add Answer</Button>
          )}
        </>
      )}

      {/* Show Generate Reflection Button */}
      {answers.length > 0 && promptIndex >= prompts.length && !reflection && (
        <Button onClick={handleAnswersSubmit} style={{ width: '100%', marginTop: '16px' }}>
          Generate My Reflection
        </Button>
      )}

      {/* Show Reset Button */}
      {(isStarted || reflection) && (
        <Button variant="outline" style={{ width: '100%', marginTop: '8px' }} onClick={handleReset}>
          Start Over
        </Button>
      )}

      {/* Final Reflection Display */}
      <AnimatePresence>
        {reflection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card id="reflection-card">
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                {name ? `${name}, here’s your strength reflection:` : "Your Strength Reflection"}
              </h2>
              <p style={{ marginBottom: '8px', color: '#333' }}>{reflection}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <Button onClick={handleCopyReflection}>Copy Reflection</Button>
              </div>

              {noThemeDetected ? (
                <div style={{ marginTop: '16px', fontSize: '14px', color: '#333' }}>
                  <p style={{ fontWeight: '500', marginBottom: '4px' }}>Need inspiration? Try including words like:</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>Helped someone through a hard time</li>
                    <li>Created something new or original</li>
                    <li>Overcame a challenge</li>
                    <li>Worked well in a team</li>
                    <li>Led a project or group</li>
                    <li>Reflected on your growth</li>
                  </ul>
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  style={{ color: 'green', marginTop: '16px', fontWeight: '500' }}
                >
                  🎉 You’ve completed your reflection journey!
                </motion.p>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
};

export default MirrorOfYou;
