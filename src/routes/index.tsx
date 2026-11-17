import { createFileRoute, Link } from "@tanstack/react-router";
import heroCamelia from "@/assets/camelia-hero.jpg";
import { CameliaBloom, SiteFooter, SiteNav } from "@/components/camelia";
import { HomeTestimonials, HomeFaq } from "@/components/home-content";
import { HomeContact } from "@/components/home-contact";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
      <section className="relative isolate overflow-hidden px-6 py-16 md:px-10 md:py-24">
        <img src={heroCamelia} alt="Sala de atendimento com maca e camélias rosa" width={1200} height={1008} className="absolute inset-0 -z-20 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-blush/85 md:bg-blush/75" />
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase text-orchid">Seu momento de cuidado</p>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-tight md:text-6xl">Camélia<br /><span className="text-orchid italic">Estética</span></h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/80">Cuidado que floresce em você. Uma pausa na rotina para se sentir bem, com o carinho que você merece.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12"><Link to="/acesso">Agendar meu horário <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline" className="h-12 bg-card/80"><Link to="/procedimentos">Ver procedimentos</Link></Button>
          </div>
          <p className="mt-8 text-sm text-ink/75">Limpeza de pele · Depilação a laser · Massagem modeladora</p>
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
                className="rounded-lg border border-rose-petal/70 bg-blush p-7"
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
            <Button asChild variant="outline" className="mt-8"><Link to="/procedimentos">Conhecer os procedimentos <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>

      <HomeTestimonials />
      <HomeFaq />
      <HomeContact />

      <SiteFooter />
    </div>
  );
}
