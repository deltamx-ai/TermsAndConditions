import { useState, useRef, useEffect } from "react";

interface TermsAndConditionsProps {
  onBack?: () => void;
  onAccept?: () => void;
  title?: string;
  children?: React.ReactNode;
}

// ── Default content ─────────────────────────────────────────────────────────
const DefaultContent = () => (
  <div className="space-y-5 text-[15px] leading-relaxed text-gray-700">
    {[
      <>
        <p>
          You should understand the relevant risks involved before investment
          and consider factors other than age and review your own investment
          objectives.
        </p>
        <p className="mt-2">
          You should understand the relevant risks involved before investment
          and consider factors other than age and review your own investment
          objectives.
        </p>
        <p className="mt-2">
          You should understand the relevant risks involved before investment
          and consider factors other than age and review your own investment
          objectives.
        </p>
      </>,
      <>
        The Manulife MPF Interest Fund and the Manulife MPF Stable Fund
        (collectively the "Guaranteed Funds") under this scheme invests solely
        in approved pooled investment funds in the form of insurance policies
        provided by Manulife (International) Limited.
      </>,
      <>
        The Manulife MPF Interest Fund and the Manulife MPF Stable Fund
        (collectively the "Guaranteed Funds") under this scheme invests solely
        in approved pooled investment funds in the form of insurance policies
        provided by Manulife (International) Limited. The guarantee is also
        given by Manulife (International) Limited. Your investments in the
        Guaranteed Funds, if any, are therefore subject to the credit risks of
        Manulife (International) Limited.
      </>,
      <>
        Investment involves risks. Past performance is not indicative of future
        performance. The value of financial products can go down as well as up.
        You should carefully consider whether any investment products or
        services are appropriate for you in view of your investment experience,
        objectives, financial resources and relevant circumstances.
      </>,
      <>
        Before making any investment decision, you should read the relevant
        offering documents (including the fund prospectus) for details,
        including the risk factors, charges and features of the funds, and seek
        independent professional advice if necessary.
      </>,
      <>
        These terms and conditions govern the use of the MPF services provided.
        By continuing, you agree to be bound by these terms. Manulife reserves
        the right to amend these terms at any time with prior notice to scheme
        members. You acknowledge that decisions should be made in consultation
        with a qualified financial adviser.
      </>,
    ].map((text, i) => (
      <div key={i} className="flex gap-3">
        <span className="mt-[9px] h-[7px] w-[7px] shrink-0 rounded-full bg-gray-800" />
        <div>{text}</div>
      </div>
    ))}
  </div>
);

// ── Icons ────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9ca3af"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function TermsAndConditions({
  onBack,
  onAccept,
  title = "Terms and conditions update",
  children,
}: TermsAndConditionsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [showBlur, setShowBlur] = useState(true);
  const [accepted, setAccepted] = useState(false);

  // ✅ Function inlined inside useEffect — no useCallback needed, no warnings
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScrollBottom = () => {
      // 24px threshold so it triggers just before absolute bottom
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      if (atBottom) {
        setHasScrolledToBottom(true);
        setShowBlur(false);
      } else {
        setShowBlur(true);
      }
    };

    el.addEventListener("scroll", checkScrollBottom, { passive: true });
    checkScrollBottom(); // run on mount: handle short content that doesn't need scrolling
    return () => el.removeEventListener("scroll", checkScrollBottom);
  }, []); // safe: scrollRef is stable, React setState setters are stable references

  const handleAccept = () => {
    if (!hasScrolledToBottom || accepted) return;
    setAccepted(true);
    onAccept?.();
  };

  return (
    <div
      className="relative flex flex-col bg-white"
      style={{ height: "100dvh", maxWidth: 430, margin: "0 auto" }}
    >
      {/* ── Fixed Header ── */}
      <header className="z-10 shrink-0 bg-white px-5 pb-4 pt-12">
        {/* Back button */}
        <button
          onClick={onBack}
          aria-label="Go back"
          className="
            -ml-1 mb-5 flex h-9 w-9 items-center justify-center rounded-full
            border-none bg-transparent text-gray-800
            transition-colors duration-150
            hover:bg-gray-100 active:bg-gray-200
          "
        >
          <ChevronLeft />
        </button>

        {/* Title */}
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-gray-900">
          {title}
        </h1>
      </header>

      {/* ── Scrollable content + blur overlay wrapper ── */}
      <div className="relative min-h-0 flex-1">
        {/* Scroll area */}
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto scroll-smooth px-5 pb-6 pt-3"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {children ?? <DefaultContent />}
        </div>

        {/* Blur gradient — fades out once user reaches the bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 transition-opacity duration-500"
          style={{
            opacity: showBlur ? 1 : 0,
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.97) 80%)",
          }}
        />
      </div>

      {/* ── Fixed Footer ── */}
      <footer className="shrink-0 bg-white px-5 pb-8 pt-3">
        {/* Tip */}
        <p
          className="mb-3 min-h-[20px] text-center text-[13.5px] font-medium leading-snug transition-colors duration-300"
          style={{ color: hasScrolledToBottom ? "#16a34a" : "#6b7280" }}
        >
          {hasScrolledToBottom ? (
            <span className="flex items-center justify-center gap-1.5">
              <CheckIcon />
              You've read all the terms
            </span>
          ) : (
            "Please scroll down to read, then agree to the terms and conditions."
          )}
        </p>

        {/* CTA button */}
        <button
          onClick={handleAccept}
          disabled={!hasScrolledToBottom || accepted}
          aria-disabled={!hasScrolledToBottom}
          className={[
            "w-full select-none rounded-2xl py-4 text-[16px] font-bold tracking-wide",
            "transition-all duration-300",
            accepted
              ? "cursor-default bg-green-600 text-white"
              : hasScrolledToBottom
              ? "cursor-pointer bg-gray-900 text-white shadow-lg shadow-gray-900/20 active:scale-[0.98]"
              : "cursor-not-allowed bg-gray-200 text-gray-400",
          ].join(" ")}
        >
          {accepted ? "✓ Accepted" : "Accept and continue"}
        </button>

        {/* Bouncing scroll-hint arrow — disappears once at bottom */}
        <div
          className="mt-3 flex flex-col items-center gap-0.5 transition-opacity duration-300"
          style={{
            opacity: hasScrolledToBottom ? 0 : 1,
            animation: hasScrolledToBottom ? "none" : "bounce 1.2s ease-in-out infinite",
          }}
          aria-hidden="true"
        >
          <div className="h-3 w-px rounded-full bg-gray-300" />
          <ChevronDown />
        </div>
      </footer>
    </div>
  );
}
