import { useState, useRef, useCallback, useEffect } from "react";

interface TermsAndConditionsProps {
  onBack?: () => void;
  onAccept?: () => void;
  title?: string;
  children?: React.ReactNode;
}

const DefaultContent = () => (
  <div className="space-y-5 text-[15px] leading-relaxed text-gray-700">
    <ul className="space-y-5 list-none">
      <li className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-800" />
        <div className="space-y-3">
          <p>
            You should understand the relevant risks involved before investment
            and consider factors other than age and review your own investment
            objectives.
          </p>
          <p>
            You should understand the relevant risks involved before investment
            and consider factors other than age and review your own investment
            objectives.
          </p>
          <p>
            You should understand the relevant risks involved before investment
            and consider factors other than age and review your own investment
            objectives.
          </p>
        </div>
      </li>

      <li className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-800" />
        <p>
          The Manulife MPF Interest Fund and the Manulife MPF Stable Fund
          (collectively the "Guaranteed Funds") under this scheme invests solely
          in approved pooled investment funds in the form of insurance policies
          provided by Manulife (International) Limited.
        </p>
      </li>

      <li className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-800" />
        <p>
          The Manulife MPF Interest Fund and the Manulife MPF Stable Fund
          (collectively the "Guaranteed Funds") under this scheme invests solely
          in approved pooled investment funds in the form of insurance policies
          provided by Manulife (International) Limited. The guarantee is also
          given by Manulife (International) Limited. Your investments in the
          Guaranteed Funds, if any, are therefore subject to the credit risks of
          Manulife (International) Limited.
        </p>
      </li>

      <li className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-800" />
        <p>
          Investment involves risks. Past performance is not indicative of
          future performance. The value of financial products can go down as
          well as up. You should carefully consider whether any investment
          products or services are appropriate for you in view of your investment
          experience, objectives, financial resources and relevant circumstances.
        </p>
      </li>

      <li className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-800" />
        <p>
          Before making any investment decision, you should read the relevant
          offering documents (including the fund prospectus) for details,
          including the risk factors, charges and features of the funds, and
          seek independent professional advice if necessary.
        </p>
      </li>

      <li className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-800" />
        <p>
          These terms and conditions govern the use of the MPF services
          provided. By continuing, you agree to be bound by these terms. Manulife
          reserves the right to amend these terms at any time with prior notice
          to scheme members.
        </p>
      </li>

      <li className="flex gap-3">
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gray-800" />
        <p>
          You acknowledge that the information provided through this platform is
          for reference only and does not constitute investment advice. Decisions
          regarding investments should be made based on your personal financial
          situation and after consultation with a qualified financial adviser.
        </p>
      </li>
    </ul>
  </div>
);

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

  const checkScrollBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    // threshold of 24px so it triggers slightly before absolute bottom
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    if (atBottom) {
      setHasScrolledToBottom(true);
      setShowBlur(false);
    } else {
      setShowBlur(true);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScrollBottom, { passive: true });
    // check on mount in case content is short
    checkScrollBottom();
    return () => el.removeEventListener("scroll", checkScrollBottom);
  }, [checkScrollBottom]);

  const handleAccept = () => {
    if (!hasScrolledToBottom) return;
    setAccepted(true);
    onAccept?.();
  };

  return (
    <div
      className="relative flex flex-col bg-white"
      style={{ height: "100dvh", maxWidth: 430, margin: "0 auto" }}
    >
      {/* ── Fixed Header ── */}
      <header className="shrink-0 px-5 pt-12 pb-4 bg-white z-10">
        {/* Back button */}
        <button
          onClick={onBack}
          aria-label="Go back"
          className="mb-5 flex items-center justify-center w-9 h-9 -ml-1 rounded-full
                     text-gray-800 hover:bg-gray-100 active:bg-gray-200
                     transition-colors duration-150"
        >
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
        </button>

        {/* Title */}
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-gray-900">
          {title}
        </h1>
      </header>

      {/* ── Scrollable Content ── */}
      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto px-5 pt-3 pb-6 scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {children ?? <DefaultContent />}
        </div>

        {/* Blur fade overlay — visible until user scrolls to bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24
                     transition-opacity duration-500"
          style={{
            opacity: showBlur ? 1 : 0,
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.96) 80%)",
          }}
        />
      </div>

      {/* ── Fixed Footer ── */}
      <footer className="shrink-0 px-5 pt-3 pb-8 bg-white">
        {/* Tip text */}
        <p
          className="mb-3 text-center text-[13.5px] leading-snug font-medium transition-colors duration-300"
          style={{ color: hasScrolledToBottom ? "#16a34a" : "#6b7280" }}
        >
          {hasScrolledToBottom ? (
            <span className="flex items-center justify-center gap-1.5">
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
              You've read all the terms
            </span>
          ) : (
            "Please scroll down to read, then agree to the terms and conditions."
          )}
        </p>

        {/* CTA Button */}
        <button
          onClick={handleAccept}
          disabled={!hasScrolledToBottom || accepted}
          aria-disabled={!hasScrolledToBottom}
          className={[
            "w-full rounded-2xl py-4 text-[16px] font-bold tracking-wide",
            "transition-all duration-300 select-none",
            hasScrolledToBottom && !accepted
              ? "bg-gray-900 text-white shadow-lg shadow-gray-900/20 active:scale-[0.98]"
              : accepted
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed",
          ].join(" ")}
        >
          {accepted ? "✓ Accepted" : "Accept and continue"}
        </button>

        {/* Scroll hint arrow — disappears when at bottom */}
        {!hasScrolledToBottom && (
          <div className="mt-3 flex flex-col items-center gap-0.5 animate-bounce">
            <div className="w-px h-3 bg-gray-300 rounded-full" />
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
          </div>
        )}
      </footer>
    </div>
  );
}
