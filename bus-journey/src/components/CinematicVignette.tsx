import React from "react";

export default function CinematicVignette() {
  return (
    <>
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 h-40 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-56 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.80) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Side vignettes */}
      <div
        className="absolute inset-y-0 left-0 w-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.40) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 w-16 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to left, rgba(0,0,0,0.40) 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Radial center darkening for cinematic feel */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
        aria-hidden="true"
      />
    </>
  );
}
