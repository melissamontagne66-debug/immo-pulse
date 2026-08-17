import { Mail, MessageCircle } from 'lucide-react';
import type { UserProfile } from '@/types/profile';

interface ShareVictoryButtonsProps {
  victoire: string;
  profile: UserProfile;
}

// Détection simple : un contact avec « @ » est un email, une suite de chiffres
// est un téléphone. Ambigu → les deux canaux sont proposés.
function isEmail(contact: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim());
}

// Numéro au format international, chiffres seuls (pour wa.me).
// Numéro FR local (06…, 07…) → préfixe 33. Retourne null si ce n'est pas un numéro.
function toWhatsAppNumber(contact: string): string | null {
  const trimmed = contact.trim();
  if (isEmail(trimmed)) return null;
  if (!/^\+?[0-9 .()-]{6,}$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, '');
  if (digits.length < 6) return null;
  if (trimmed.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = `33${digits.slice(1)}`;
  return digits;
}

// MOD-32 — Partage d'une victoire au parrain (ou à qui on veut, sans parrain
// déclaré : mailto sans destinataire / wa.me sans numéro — jamais de cul-de-sac).
// Réutilisable : bilan (step 2) et célébrations de palier (App.tsx).
export function ShareVictoryButtons({ victoire, profile }: ShareVictoryButtonsProps) {
  const text = victoire.trim();
  if (!text) return null;

  const parrain = profile.parrain;
  const prenom = profile.firstName;

  const mailBody = parrain
    ? `Salut ${parrain.prenom}, ${text} — ${prenom}`
    : `${text} — ${prenom}`;
  const waText = parrain
    ? `Salut ${parrain.prenom} 🎉 ${text} — ${prenom}`
    : `🎉 ${text} — ${prenom}`;

  const contact = parrain?.contact ?? '';
  const mailOk = !parrain || isEmail(contact) || !toWhatsAppNumber(contact);
  const waNumber = parrain ? toWhatsAppNumber(contact) : null;
  const waOk = !parrain || waNumber !== null || !isEmail(contact);

  const mailto = `mailto:${parrain && isEmail(contact) ? contact.trim() : ''}?subject=${encodeURIComponent('🏆 Une victoire à te raconter !')}&body=${encodeURIComponent(mailBody)}`;
  const waUrl = `https://wa.me/${waNumber ?? ''}?text=${encodeURIComponent(waText)}`;

  return (
    <div>
      <p className="text-sm font-semibold text-gray-900 mb-2">
        {parrain ? `Envoyer ma victoire à ${parrain.prenom}` : 'Partager ma victoire'}
      </p>
      <div className="flex gap-2 flex-wrap">
        {mailOk && (
          <a
            href={mailto}
            className="flex-1 min-w-[8rem] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Par email
          </a>
        )}
        {waOk && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[8rem] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Par WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
