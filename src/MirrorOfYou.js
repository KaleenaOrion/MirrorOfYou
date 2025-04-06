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

 // 🧠 Config object for trigger words
 const themeTriggers = {
  creativity: [
    "imagine", "create", "build", "express", "invent", "dream",
    "design", "compose", "craft", "innovate", "draw", "write"
  ],
  empathy: [
    "help", "feel", "listen", "understand", "comfort", "care",
    "support", "empathize", "connect", "nurture", "soothe", "uplift"
  ],
  leadership: [
    "lead", "guide", "inspire", "delegate", "direct", "vision",
    "manage", "mentor", "coach", "organize", "decide", "empower"
  ],
  resilience: [
    "overcome", "persist", "survive", "struggle", "rise", "endure",
    "bounce back", "cope", "adapt", "healed", "grew", "recovered", "fought"
  ],
  strategy: [
    "plan", "analyze", "optimize", "solve", "structure", "map",
    "strategize", "evaluate", "forecast", "organize", "decide", "improve"
  ],
  collaboration: [
    "team", "collaborate", "co-create", "group", "share", "support",
    "contribute", "connect", "unite", "brainstorm", "combine", "cooperate"
  ],
  selfAwareness: [
    "aware", "reflect", "notice", "observe", "journal", "insight",
    "understand myself", "inner work", "growth", "recognize", "accept", "mindful"
  ],
};

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

      Object.entries(themeTriggers).forEach(([theme, words]) => {
        if (words.some((word) => text.includes(word))) {
          themes[theme]++;
        }
      });
    });

    return Object.entries(themes)
      .sort((a, b) => b[1] - a[1])
      .filter(([_, count]) => count > 0)
      .map(([theme]) => theme);
  };

  const reflections = {
    creativity: `You shine as a creator.
  Not just because you make things, but because you see the world differently.
  Where others see limits, you imagine new pathways.
  You turn ordinary moments into something meaningful, expressive, alive.
  Your ideas don’t just inspire—they invite others to dream too.
  There’s magic in that, and it lives in you.`,
  
    empathy: `You feel deeply, and that’s not a weakness.
  You carry others when they can’t carry themselves.
  You listen past the words, sense what’s unspoken, and offer comfort like a steady flame.
  People may not always say it, but your presence is healing.
  You remind the world what it means to care.
  That’s rare, and it matters more than you know.`,
  
    leadership: `You don’t just lead—you lift.
  You see the potential in people before they see it in themselves.
  You guide with vision, but you never forget the heart.
  Your influence isn’t loud; it’s lasting.
  When you move, others move with you, not because they have to—because they trust you.
  And you’ve earned that trust.`,
  
    resilience: `You’ve been through the fire, but it didn’t consume you.
  It shaped you.
  Every scar tells a story of survival.
  You’ve fallen, gotten back up, and kept going—even when no one saw the effort it took.
  Your strength isn’t in how you hide your pain.
  It’s in how you show up anyway.
  That’s resilience, and it runs deep in you.`,
  
    strategy: `Your mind is a quiet force.
  You see the pieces before anyone else even knows there’s a puzzle.
  You anticipate, adapt, and design smarter ways forward.
  It’s not just logic—it’s vision.
  You bring clarity to chaos and direction to uncertainty.
  That gift makes you a builder of futures.`,
  
    collaboration: `You’re the kind of person who brings people together.
  You know how to make space for every voice and find the rhythm in a room.
  You turn group efforts into shared victories.
  There’s a generosity in how you show up—not just for yourself, but for the whole.
  You remind people what it means to be part of something.
  That’s not small. That’s connection.`,
  
    selfAwareness: `You’ve done the work most people avoid.
  You’ve looked inward, asked the hard questions, and owned your growth.
  That kind of honesty takes courage.
  You notice your patterns.
  You recognize your impact.
  And even when it’s uncomfortable, you keep growing.
  You’re not just becoming someone new—you’re becoming more you.`
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
        <button
        onClick={handleAnswersSubmit}
        className="w-full mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition duration-150"
      >
        Generate My Reflection
      </button>
      )}

      {/* Show Reset Button */}
      {(isStarted || reflection) && (
        <button
        onClick={handleReset}
        className="w-full mt-2 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition duration-150"
      >
        Start Over
      </button>      
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
