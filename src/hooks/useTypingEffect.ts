import { useState, useEffect } from 'react';

function useTypingEffect(words: string[], typingSpeed = 150, deletingSpeed = 100, delayBetweenWords = 1500) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typingTimeout: ReturnType<typeof setTimeout>;

    const currentWord = words[wordIndex % words.length];

    if (!isDeleting) {
      // Typing
      if (text.length < currentWord.length) {
        typingTimeout = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, typingSpeed);
      } else {
        // Wait before deleting
        typingTimeout = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetweenWords);
      }
    } else {
      // Deleting
      if (text.length > 0) {
        typingTimeout = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(typingTimeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return text;
}

export default useTypingEffect;