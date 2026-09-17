import { createFileRoute, Link } from "@tanstack/react-router";
import heroCamelia from "@/assets/camelia-hero.jpg";
import { CameliaBloom, SiteFooter, SiteNav } from "@/components/camelia";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Camélia Estética · Cuidado que floresce em você" },
      {
        name: "description",
        content:
          "Agende limpeza de pele, depilação a laser e massagem modeladora na Camélia Estética. Horários livres na hora, sem ligar nem esperar resposta.",
      },
      { property: "og:title", content: "Camélia Estética · Agendamento online" },
      {
        property: "og:description",
        content:
          "Sessões avulsas ou em pacote com profissionais especializadas e uma agenda que se organiza sozinha.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const passos = [
  {
    numero: "01",
    titulo: "Escolha o procedimento",
    texto: "Veja duração e valor de cada sessão antes de decidir.",
  },
  {
    numero: "02",
    titulo: "Pegue o horário livre",
    texto: "A agenda mostra apenas horários realmente disponíveis.",
  },
  {
    numero: "03",
    titulo: "Confirme e pronto",
    texto: "Cancele ou remarque sozinha, com até 2 horas de antecedência.",
  },
];

const destaques = [
  {
    titulo: "Profissionais especializadas",
    texto: "Cada procedimento é conduzido por quem é dedicada exclusivamente a ele.",
  },
  {
    titulo: "Pacotes com saldo visível",
    texto: "Acompanhe quantas sessões ainda tem e quanto falta pagar.",
  },
  {
    titulo: "Agenda sempre atualizada",
    texto: "Sem conflito de horário: dois atendimentos nunca caem no mesmo espaço.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-blush font-body text-ink">
      <SiteNav current="inicio" />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-14 pb-20 md:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -right-20 h-96 w-96 rounded-full bg-lilac/30 blur-2xl" />
          <div className="absolute top-52 -left-16 h-72 w-72 rounded-full bg-rose-petal/60 blur-2xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-lilac/20 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-orchid">
              Agendamento online
            </span>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-ink md:text-6xl">
              Cuidado que floresce em{" "}
              <span className="text-orchid italic">você</span>.
            </h1>
            <p className="mt-5 max-w-md text-lg text-ink/60">
              Sessões avulsas ou em pacote, com profissionais especializadas e uma agenda que
              se organiza sozinha. Marque seu horário em poucos minutos, sem precisar ligar ou
              esperar resposta no WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/acesso"
                className="rounded-full bg-orchid px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-mauve"
              >
                Agendar meu horário
              </Link>
              <Link
                to="/procedimentos"
                className="rounded-full bg-rose-petal px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-petal/60"
              >
                Ver procedimentos
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["3", "profissionais especializadas"],
                ["7", "dias de agenda aberta"],
                ["2h", "de antecedência para remarcar"],
              ].map(([num, label]) => (
                <div key={label}>
                  <dt className="font-serif text-3xl text-orchid">{num}</dt>
                  <dd className="mt-1 text-xs leading-snug text-ink/55">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <img
              src={heroCamelia}
              alt="Sala de atendimento da Camélia Estética com maca branca, toalhas e camélias rosa"
              width={1200}
              height={1008}
              className="w-full rounded-[2rem] object-cover shadow-xl shadow-mauve/20 outline-1 -outline-offset-1 outline-black/5"
            />
            <div className="absolute -bottom-6 -left-4 w-60 rounded-2xl bg-card p-5 shadow-xl shadow-lilac/30 md:-left-8">
              <p className="text-xs text-ink/50">Próximo horário livre</p>
              <p className="mt-1 font-serif text-2xl text-ink">Amanhã · 09h00</p>
              <p className="mt-1 text-xs text-orchid">Limpeza de Pele · Bianca Rocha</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-card px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl text-ink">Como funciona</h2>
          <p className="mt-2 text-sm text-ink/55">
            Três passos entre a vontade de se cuidar e a sessão marcada.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {passos.map((p) => (
              <div
                key={p.numero}
                className="rounded-3xl border border-rose-petal/70 bg-blush p-7 transition-shadow hover:shadow-lg hover:shadow-rose-petal/50"
              >
                <span className="font-serif text-3xl text-petal">{p.numero}</span>
                <h3 className="mt-3 font-serif text-xl text-ink">{p.titulo}</h3>
                <p className="mt-2 text-sm text-ink/55">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que a Camélia */}
      <section className="bg-sage-soft/25 px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[280px_1fr]">
          <CameliaBloom className="mx-auto w-56" />
          <div>
            <h2 className="font-serif text-4xl text-ink">Por que a Camélia</h2>
            <div className="mt-6 space-y-5">
              {destaques.map((d) => (
                <div key={d.titulo} className="flex gap-4">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-mauve" />
                  <div>
                    <h3 className="font-serif text-xl text-ink">{d.titulo}</h3>
                    <p className="mt-1 text-sm text-ink/60">{d.texto}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/procedimentos"
              className="mt-8 inline-block rounded-full border border-mauve/60 px-6 py-3 text-sm text-ink transition-colors hover:bg-rose-petal/50"
            >
              Conhecer os procedimentos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blush px-6 py-20 md:px-10">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-ink px-8 py-14 text-center">
          <h2 className="font-serif text-4xl text-blush">Sua próxima sessão começa aqui</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-blush/65">
            Entre com seu CPF ou crie sua conta em menos de um minuto e escolha o horário que
            couber na sua rotina.
          </p>
          <Link
            to="/acesso"
            className="mt-8 inline-block rounded-full bg-petal px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-rose-petal"
          >
            Entrar ou criar conta
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
