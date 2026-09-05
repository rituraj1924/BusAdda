"use client";
import React, { useState } from "react";

/**
 * Detects social media in-app browsers (Instagram, Facebook, TikTok, Twitter/X, Snapchat, etc.)
 * and shows a small dismissible banner prompting the user to open in their default browser.
 *
 * Normal browsers (Chrome, Safari, Firefox) are NOT affected.
 */
function detectInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /Instagram/i.test(ua) ||       // Instagram
    /FBAN|FBAV/i.test(ua) ||       // Facebook
    /FB_IAB/i.test(ua) ||          // Facebook in-app
    /TikTok/i.test(ua) ||          // TikTok
    /Twitter/i.test(ua) ||         // Twitter/X
    /Snapchat/i.test(ua) ||        // Snapchat
    /Line\//i.test(ua) ||          // LINE messenger
    /Pinterest/i.test(ua) ||       // Pinterest
    /\bwv\b/.test(ua) && /Android/.test(ua) // Generic Android WebView (wv flag)
  );
}

function openInExternalBrowser() {
  const url = window.location.href;
  const ua = navigator.userAgent;

  // Android: try intent:// scheme to open in Chrome
  if (/Android/i.test(ua)) {
    const intentUrl =
      `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;
    return;
  }

  // iOS: deep-link to open in Safari or Chrome via x-safari-https
  if (/iPhone|iPad|iPod/i.test(ua)) {
    // Try opening with googlechrome scheme first, fallback to plain href
    const chromeUrl = url.replace(/^https/, "googlechromes").replace(/^http/, "googlechrome");
    window.location.href = chromeUrl;
    // Fallback: after 1s if chrome scheme didn't work, open as is
    setTimeout(() => {
      window.location.href = url;
    }, 1000);
    return;
  }

  // Desktop fallback: copy URL or open in new tab
  window.open(url, "_blank");
}

export default function InAppBrowserBanner() {
  // Detect once on mount — useMemo avoids repeated UA checks on re-renders
  const isInApp = React.useMemo(() => detectInAppBrowser(), []);
  const [dismissed, setDismissed] = useState(false);

  if (!isInApp || dismissed) return null;

  return (
    <div
      className="fixed top-4 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none"
      role="alert"
      aria-live="polite"
    >
      <div
        className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-2xl text-xs font-medium"
        style={{
          background: "rgba(10, 10, 20, 0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          maxWidth: "340px",
          width: "100%",
        }}
      >
        {/* Icon */}
        <span className="text-base flex-shrink-0">🌐</span>

        {/* Message */}
        <span className="text-white/80 flex-1 leading-snug">
          For best experience,{" "}
          <button
            type="button"
            onClick={openInExternalBrowser}
            className="text-amber-300 underline underline-offset-2 hover:text-amber-200 cursor-pointer font-semibold transition-colors"
          >
            open in browser
          </button>
        </span>

        {/* Dismiss */}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss banner"
          className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer text-[10px]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
