"use client";

import Typewriter from "typewriter-effect";

interface TypedTextProps {
  text: string;
  delay?: number;
  loop?: boolean;
}

export default function TypedText({
  text,
  delay = 60,
  loop = false,
}: TypedTextProps) {
  return (
    <Typewriter
      onInit={(typewriter) => {
        typewriter.typeString(text).start();
      }}
      options={{
        loop,
        delay,
      }}
    />
  );
}
