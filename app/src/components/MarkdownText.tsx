import { Fragment } from 'react';

// Rendu markdown minimal pour les contenus de cartes (descriptions, scripts,
// conseils) : **gras** → <strong>, sauts de ligne → <br />.
// Les lignes commençant par « → » ou « - » sont déjà des puces visuelles.
function renderInline(line: string, lineIndex: number) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.length > 4 && part.startsWith('**') && part.endsWith('**')
      ? <strong key={`${lineIndex}-${i}`}>{part.slice(2, -2)}</strong>
      : <Fragment key={`${lineIndex}-${i}`}>{part}</Fragment>
  );
}

export function MarkdownText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {renderInline(line, i)}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}
