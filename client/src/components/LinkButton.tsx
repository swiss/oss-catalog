export function LinkButton({ href, text }: { href: string; text: string }) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      className="btn btn--base btn--outline"
    >
      <span className="btn__text">{text}</span>
      <svg
        viewBox="0 0 24 24"
        className="btn__icon icon icon--base icon--ArrowRight"
      >
        <path d="m16.444 19.204 4.066-7.044-4.066-7.044-.65.375 3.633 6.294h-15.187v.75h15.187l-3.633 6.294z"></path>
      </svg>
    </a>
  );
}
