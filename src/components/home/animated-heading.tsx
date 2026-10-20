"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";

export function AnimatedHeading({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span className="inline-block overflow-hidden">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </span>
    </Tag>
  );
}
