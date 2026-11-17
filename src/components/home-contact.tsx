import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Campo, inputClass } from "@/components/camelia";
import { CONTACT_EMAIL, contactMailto } from "@/lib/contact";

type ContactDraft = { nome: string; email: string; assunto: string; mensagem: string };

export function HomeContact() {
  const [draft, setDraft] = useState<ContactDraft | null>(null);

  function revisar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nome = String(data.get("nome") ?? "").trim();
    const mensagem = String(data.get("mensagem") ?? "").trim();
    if (!nome || !mensagem) {
      const field = form.elements.namedItem(!nome ? "nome" : "mensagem");
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.setCustomValidity("Preencha este campo com seu texto.");
        field.reportValidity();
      }
      return;
    }
    setDraft({ nome, email: String(data.get("email") ?? "").trim(), assunto: String(data.get("assunto") ?? ""), mensagem });
  }

  return (
    <section aria-labelledby="contato-title" className="bg-sage-soft/35 px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <span className="grid h-12 w-12 place-items-center rounded-full bg-card text-sage-deep"><Mail aria-hidden="true" className="h-5 w-5" /></span>
          <p className="mt-6 text-xs font-medium uppercase text-sage-deep">Vamos conversar</p>
          <h2 id="contato-title" className="mt-3 font-serif text-3xl md:text-4xl">Seu cuidado começa<br />com uma conversa.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">Tem uma dúvida sobre um procedimento ou quer conversar sobre pacotes? Deixe sua mensagem para a recepção.</p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 inline-flex max-w-full items-center gap-2 break-all text-sm text-sage-deep underline underline-offset-4"><Mail className="h-4 w-4 shrink-0" /> {CONTACT_EMAIL}</a>
        </div>
        <div className="min-w-0">
          <form onSubmit={revisar} className={draft ? "hidden" : "space-y-3"}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo label="Seu nome"><input name="nome" autoComplete="name" required maxLength={100} defaultValue={draft?.nome} onInput={(e) => e.currentTarget.setCustomValidity("")} className={inputClass} placeholder="Como podemos chamar você?" /></Campo>
              <Campo label="Seu e-mail"><input name="email" type="email" autoComplete="email" required maxLength={254} defaultValue={draft?.email} className={inputClass} placeholder="voce@exemplo.com" /></Campo>
            </div>
            <Campo label="Assunto"><select name="assunto" className={inputClass}><option>Dúvida sobre procedimentos</option><option>Pacotes e pagamentos</option><option>Meu agendamento</option><option>Outro assunto</option></select></Campo>
            <Campo label="Mensagem"><textarea name="mensagem" required maxLength={2000} rows={5} onInput={(e) => e.currentTarget.setCustomValidity("")} className={`${inputClass} resize-y`} placeholder="Conte o que você gostaria de saber…" /></Campo>
            <Button type="submit" className="h-11 bg-sage-deep text-primary-foreground hover:bg-sage-deep/90">Revisar mensagem <ArrowRight /></Button>
          </form>
          {draft && (
            <div role="status" className="border-t border-sage/40 pt-5">
              <p className="flex items-center gap-2 font-medium text-sage-deep"><Check className="h-4 w-4" /> Mensagem revisada · ainda não enviada</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div><dt className="text-muted-foreground">De</dt><dd className="break-words">{draft.nome} · {draft.email}</dd></div>
                <div><dt className="text-muted-foreground">Assunto</dt><dd>{draft.assunto}</dd></div>
                <div><dt className="text-muted-foreground">Mensagem</dt><dd className="mt-1 whitespace-pre-wrap break-words leading-relaxed">{draft.mensagem}</dd></div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setDraft(null)}><Pencil /> Editar mensagem</Button>
                <Button asChild><a href={contactMailto(draft)}><Mail /> Abrir no e-mail</a></Button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">O envio deve ser confirmado no seu aplicativo de e-mail.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}