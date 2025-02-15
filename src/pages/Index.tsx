
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleEffect from '../components/ParticleEffect';

const Index = () => {
  const [answer, setAnswer] = useState('');
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInput(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      navigate('/agents/rasputin', { state: { answer } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <ParticleEffect />
      
      <div className="relative z-[1] max-w-2xl mx-auto px-4 text-center">
        <h1 className="mystical-text text-2xl md:text-3xl lg:text-4xl mb-8 fade-in text-white">
          "You are already dead and waiting to die—whoever hath, to him shall be given, and for he who hath not, all shall be taken away."
        </h1>

        {showInput && (
          <form onSubmit={handleSubmit} className="fade-in">
            <div className="relative mt-12">
              <label htmlFor="answer" className="mystical-text block mb-4 text-xl text-white">
                Are you a have or a have not?
              </label>
              <input
                type="text"
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                maxLength={5000}
                className="w-full bg-transparent border-b-2 border-white/20 focus:border-white/60 outline-none px-4 py-2 text-center mystical-text text-lg transition-colors text-white"
                autoFocus
              />
              <div className="typing-cursor" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;
