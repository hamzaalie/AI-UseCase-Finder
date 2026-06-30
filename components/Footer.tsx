export default function Footer() {
  return (
    <footer className="border-t border-ink/10 py-8 text-sm text-muted">
      <p>
        Built by{" "}
        <span className="font-medium text-ink">Hamza Ali</span> · Netsol AI ·{" "}
        <a
          href="https://netsolai.cz"
          className="underline decoration-ink/30 underline-offset-2 hover:text-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          netsolai.cz
        </a>
      </p>
    </footer>
  );
}
