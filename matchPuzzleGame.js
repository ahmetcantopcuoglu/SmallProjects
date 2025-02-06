'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const emojis = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🥝', '🍍', '🥥', '🍑', '🍊', '🥭', '🍋', '🍈', '🍏', '🍐', '🫐', '🌰', '🥜', '🥑', '🥔', '🥕', '🌽', '🥒', '🫑', '🧄', '🧅', '🥦', '🍄', '🥬', '🥗'];

const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateEmojis = () => {
  const selectedEmojis = emojis.slice(0, 18);
  const emojiPairs = [...selectedEmojis, ...selectedEmojis];
  return shuffleArray(emojiPairs);
};

export default function EmojiMatchGame() {
  const [grid, setGrid] = useState(generateEmojis());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let timer;
    if (running) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (matched.length === 36) {
      setRunning(false);
      setGameOver(true);
    }
  }, [matched]);

  const handleCardClick = (index) => {
    if (!running) setRunning(true);
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setTimeout(() => {
        const [first, second] = newFlipped;
        if (grid[first] === grid[second]) {
          setMatched([...matched, first, second]);
        }
        setFlipped([]);
      }, 500);
    }
  };

  const getResultMessage = () => {
    if (time < 60) return 'Harika! Çok hızlısınız!';
    if (time < 100) return 'Orta seviye, daha da hızlanabilirsin!';
    return 'Oldukça yavaşsın, biraz daha pratik yapman gerekli!';
  };

  const resetGame = () => {
    setGrid(generateEmojis());
    setFlipped([]);
    setMatched([]);
    setTime(0);
    setRunning(false);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <p className="text-lg font-semibold">Süre: {time} saniye</p>
      <div className="grid grid-cols-6 gap-2">
        {grid.map((emoji, index) => (
          <Card key={index} onClick={() => handleCardClick(index)} className="w-16 h-16 flex items-center justify-center cursor-pointer">
            <CardContent>
              {flipped.includes(index) || matched.includes(index) ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="text-2xl">{emoji}</span>
                </motion.div>
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {gameOver && (
        <Dialog open={gameOver}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Oyun Bitti!</DialogTitle>
            </DialogHeader>
            <p>{getResultMessage()}</p>
            <p>Toplam Süre: {time} saniye</p>
            <Button onClick={resetGame}>Tekrar Oyna</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
