import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";

const petalRotations = [0, 72, 144, 216, 288];

export function CameliaMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <g transform="translate(20,20)">
        {petalRotations.map((rot, i) => (
          <g key={rot} transform={`rotate(${rot})`}>
            <ellipse
              cx="0"
              cy="-9.5"
              rx="6"
              ry="8.5"
              fill={i % 2 === 0 ? "var(--petal)" : "var(--rose-petal)"}
              stroke="var(--mauve)"
              strokeWidth="0.5"
            />
          </g>
        ))}
        <circle cx="0" cy="0" r="3.4" fill="var(--gold)" />
      </g>
    </svg>
  );
}

export function CameliaBloom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <path
        d="M100 260 C100 180 90 150 100 110"
        stroke="var(--sage-deep)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M100 200 C80 195 65 180 65 165 C85 165 100 178 100 200Z" fill="var(--sage)" />
      <path d="M100 175 C123 170 138 154 138 138 C116 138 100 152 100 175Z" fill="var(--sage-soft)" />
      <g transform="translate(100,90) scale(4.2)">
        {petalRotations.map((rot, i) => (
          <g key={rot} transform={`rotate(${rot})`}>
            <ellipse
              cx="0"
              cy="-9.5"
              rx="6"
              ry="8.5"
              fill={i % 2 === 0 ? "var(--mauve)" : "var(--petal)"}
              stroke="var(--ink)"
              strokeWidth="0.25"
              opacity="0.95"
            />
          </g>
        ))}
        <circle cx="0" cy="0" r="3.2" fill="var(--gold)" />
      </g>
    </svg>
  );
}

export function SiteNav({ current }: { current: "inicio" | "procedimentos" }) {
  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-rose-petal/60 bg-blush/85 px-6 py-4 backdrop-blur-md md:px-10">
      <Link to="/" className="flex items-center gap-2.5">
        <CameliaMark />
        <span className="font-serif text-xl text-ink md:text-2xl">Camélia Estética</span>
      </Link>
      <div className="flex items-center gap-2 md:gap-5">
        <Link
          to="/"
          className={`hidden text-sm transition-colors md:inline hover:text-orchid ${
            current === "inicio" ? "text-orchid" : "text-ink/65"
          }`}
        >
          Início
        </Link>
        <Link
          to="/procedimentos"
          className={`text-sm transition-colors hover:text-orchid ${
            current === "procedimentos" ? "text-orchid" : "text-ink/65"
          }`}
        >
          Procedimentos
        </Link>
        <Link
          to="/acesso"
          className="rounded-full bg-orchid px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-mauve"
        >
          Entrar
        </Link>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <CameliaMark className="h-7 w-7" />
          <span className="font-serif text-lg text-blush">Camélia Estética</span>
        </div>
        <p className="text-xs text-blush/55">
          Cuidado que floresce em você · protótipo acadêmico de agendamento
        </p>
      </div>
    </footer>
  );
}

export function AppTopbar({
  subtitulo,
  nome,
  onSair,
}: {
  subtitulo: string;
  nome: string;
  onSair: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-rose-petal/60 bg-blush/90 px-6 py-3.5 backdrop-blur-md md:px-10">
      <Link to="/" className="flex items-center gap-3">
        <CameliaMark />
        <span>
          <span className="block font-serif text-lg leading-tight text-ink">
            Camélia Estética
          </span>
          <span className="block text-xs text-ink/55">{subtitulo}</span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink/70">{nome}</span>
        <button
          onClick={onSair}
          className="rounded-full border border-mauve/50 px-4 py-2 text-sm text-ink transition-colors hover:bg-rose-petal/50"
        >
          Sair
        </button>
      </div>
    </header>
  );
}

export function Panel({
  titulo,
  acao,
  children,
}: {
  titulo: string;
  acao?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-rose-petal/70 bg-card p-6 shadow-sm shadow-rose-petal/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-rose-petal/60 pb-3">
        <h2 className="font-serif text-2xl text-ink">{titulo}</h2>
        {acao}
      </div>
      {children}
    </section>
  );
}

export function Campo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink/55">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-rose-petal bg-blush/60 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-orchid focus:bg-card";

export function Mensagem({
  texto,
  tipo = "erro",
}: {
  texto: string | null;
  tipo?: "erro" | "sucesso";
}) {
  if (!texto) return null;
  return (
    <p
      className={`mt-3 rounded-xl px-4 py-2.5 text-sm ${
        tipo === "sucesso"
          ? "bg-sage-soft/50 text-sage-deep"
          : "bg-destructive/10 text-destructive"
      }`}
      role="status"
    >
      {texto}
    </p>
  );
}

export function Badge({ status }: { status: string }) {
  const estilos: Record<string, string> = {
    agendada: "bg-lilac/25 text-orchid",
    realizada: "bg-sage-soft/60 text-sage-deep",
    cancelada: "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
        estilos[status] ?? "bg-rose-petal/60 text-ink/70"
      }`}
    >
      {status}
    </span>
  );
}

export function Vazio({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl bg-blush/70 px-4 py-6 text-center text-sm text-ink/50">
      {children}
    </p>
  );
}
