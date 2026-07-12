import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { faqItems } from "../data/mockData";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-xl border border-white/5 bg-slate-950/40 backdrop-blur-md overflow-hidden transition-all duration-300"
          >
            {/* Trigger Button */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full text-left p-4.5 flex justify-between items-center gap-4 cursor-pointer"
            >
              <div className="flex gap-3 items-start text-sm md:text-base font-bold text-slate-100 font-sans">
                <HelpCircle className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{item.question}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-blue-400" : ""
                }`}
              />
            </button>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-4.5 pb-4.5 pt-1 text-slate-400 text-xs md:text-sm leading-relaxed font-sans border-t border-white/5 bg-slate-900/10">
                    {/* Format some parts nicely if needed */}
                    {item.answer.split("**").map((text, idx) =>
                      idx % 2 === 1 ? (
                        <strong key={idx} className="text-white font-semibold">
                          {text}
                        </strong>
                      ) : (
                        text
                      )
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
