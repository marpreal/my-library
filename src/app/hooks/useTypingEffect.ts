"use client";

import { useState, useEffect } from "react";

export function useTypingEffect(userName: string, typingSpeed = 100) {
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    if (!userName || userName === "Your") return;

    setTitle("");
    const fullTitle = `${userName}'s Infinity Box`;
    let i = 0;

    const interval = setInterval(() => {
      setTitle(fullTitle.slice(0, i + 1));
      i++;

      if (i >= fullTitle.length) clearInterval(interval);
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [userName]);

  return title;
}
