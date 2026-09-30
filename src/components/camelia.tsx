import { Link } from "@tanstack/react-router";
import { CalendarDays, CreditCard, Home, LogOut, Package, Sparkles, UserRound } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";

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

type AppSection = "agenda" | "pacotes" | "financeiro";

const roleLabels = {
  cliente: "Área da cliente",
  secretaria: "Recepção",
  profissional: "Área profissional",
};

export function AppShell({
  role,
  nome,
  subtitulo,
  active = "agenda",
  onSair,
  children,
}: {
  role: keyof typeof roleLabels;
  nome: string;
  subtitulo?: string;
  active?: AppSection;
  onSair: () => void;
  children: ReactNode;
}) {
  const nav = role === "secretaria"
    ? [
        { id: "agenda" as const, label: "Agenda", icon: CalendarDays },
        { id: "pacotes" as const, label: "Clientes e pacotes", icon: Package },
        { id: "financeiro" as const, label: "Financeiro", icon: CreditCard },
      ]
    : role === "cliente"
      ? [
          { id: "agenda" as const, label: "Agendar", icon: CalendarDays },
          { id: "pacotes" as const, label: "Minhas sessões", icon: Sparkles },
        ]
      : [
          { id: "agenda" as const, label: "Minha agenda", icon: CalendarDays },
        ];

  return (
    <div className="min-h-screen bg-blush font-body text-ink lg:p-5">
      <div className="mx-auto min-h-screen max-w-[1480px] overflow-hidden border-rose-petal/70 bg-card shadow-xl shadow-rose-petal/25 lg:min-h-[calc(100vh-2.5rem)] lg:rounded-2xl lg:border">
        <div className="flex min-h-inherit flex-col lg:flex-row">
          <aside className="flex shrink-0 flex-col border-b border-rose-petal/70 bg-blush/80 px-5 py-4 lg:w-64 lg:border-r lg:border-b-0 lg:p-7">
            <Link to="/" className="flex items-center gap-3">
              <CameliaMark className="h-10 w-10" />
              <span>
                <span className="block font-serif text-xl leading-none text-ink">Camélia</span>
                <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] text-ink/45">Estética avançada</span>
              </span>
            </Link>

            <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-12 lg:block lg:space-y-2" aria-label="Área interna">
              {nav.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active === id
                      ? "border border-rose-petal bg-card font-medium text-sage-deep shadow-sm"
                      : "text-ink/55 hover:bg-card/70 hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              ))}
            </nav>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-lg bg-rose-petal/35 p-3 lg:mt-auto">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-sm font-semibold text-orchid">
                  {nome.charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-ink">{nome}</span>
                  <span className="block truncate text-[10px] text-ink/45">{roleLabels[role]}</span>
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={onSair} aria-label="Sair" title="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="flex min-h-20 items-center justify-between border-b border-rose-petal/55 px-5 py-4 md:px-8">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-orchid">{roleLabels[role]}</p>
                <p className="mt-1 text-sm text-ink/50">{subtitulo ?? "Tudo organizado para o seu dia"}</p>
              </div>
              <Link to="/" className="hidden items-center gap-2 text-xs text-ink/50 hover:text-sage-deep sm:flex">
                <Home className="h-4 w-4" /> Página inicial
              </Link>
            </header>
            <main className="page-enter p-5 md:p-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-sage-deep">{eyebrow}</p>}
        <h1 className="font-serif text-3xl text-ink md:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-ink/50">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, detail, icon }: { label: string; value: string | number; detail?: string; icon?: ReactNode }) {
  return (
    <div className="border-l-2 border-rose-petal bg-blush/45 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-ink/45">{label}</p>
        <span className="text-sage-deep">{icon}</span>
      </div>
      <p className="mt-1 font-serif text-2xl text-ink">{value}</p>
      {detail && <p className="mt-0.5 text-[11px] text-ink/40">{detail}</p>}
    </div>
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
    <section className="rounded-xl border border-rose-petal/70 bg-card p-5 shadow-sm shadow-rose-petal/25 md:p-6">
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
  "w-full rounded-lg border border-rose-petal bg-blush/45 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-orchid focus:bg-card focus:ring-2 focus:ring-lilac/30";

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
