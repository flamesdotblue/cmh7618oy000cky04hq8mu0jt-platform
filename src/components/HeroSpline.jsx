import React from 'react';
import Spline from '@splinetool/react-spline';
import { Sparkles } from 'lucide-react';

export default function HeroSpline() {
  return (
    <section className="relative w-full">
      <div className="relative h-[70vh] sm:h-[78vh] w-full">
        <Spline
          scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-neutral-950/10 via-neutral-950/40 to-neutral-950" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
              <Sparkles size={14} /> Context-aware multimodal inference
            </div>
            <h1 className="mt-4 text-4xl sm:text-6xl font-semibold tracking-tight">
              Understand Emotions Across Text, Audio, Image, and Video
            </h1>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              A unified interface for emotion recognition that merges language cues, tone, and visual signals for richer human-computer interaction.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <a href="#modules" className="rounded-md bg-white text-neutral-900 px-5 py-2.5 text-sm font-medium hover:bg-white/90 transition">Explore Modules</a>
              <a href="#about" className="rounded-md border border-white/20 px-5 py-2.5 text-sm hover:bg-white/10 transition">Learn More</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
