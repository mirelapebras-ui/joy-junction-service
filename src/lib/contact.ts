export const CONTACT_EMAIL = "mirelapebras@gmail.com";

export function contactMailto(draft: { nome: string; email: string; assunto: string; mensagem: string }) {
  const body = `Nome: ${draft.nome}\nE-mail para resposta: ${draft.email}\n\n${draft.mensagem}`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(draft.assunto)}&body=${encodeURIComponent(body)}`;
}