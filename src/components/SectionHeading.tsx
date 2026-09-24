import React from "react";
import { FadeIn } from "./MotionWrapper";

interface SectionHeadingProps {
  badge: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "center" | "left";
  id?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  titleHighlight = "",
  subtitle = "",
  align = "center",
  id,
}) => {
  const isCenter = align === "center";

  return (
    <div id={id} className={`max-w-3xl mb-12 ${isCenter ? "mx-auto text-center" : "text-left"}`}>
      <FadeIn>
        {/* Cinematic Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-blue-500/20 bg-blue-950/40 text-blue-400 font-mono text-[11px] tracking-widest uppercase shadow-[0_0_15px_rgba(59,130,246,0.08)]`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {badge}
        </div>

        {/* Title Heading */}
        <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-white mb-4 leading-tight">
          {title}{" "}
          {titleHighlight && (
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(56,189,248,0.15)]">
              {titleHighlight}
            </span>
          )}
        </h2>

        {/* Subtitle Body */}
        {subtitle && (
          <p className="text-base text-slate-400 font-sans leading-relaxed">
            {subtitle}
          </p>
        )}
      </FadeIn>
    </div>
  );
};
