import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  formatarMoeda,
  listarProcedimentos,
  listarProfissionais,
  popularDadosDeExemplo,
  type Procedimento,
  type Profissional,
} from "@/lib/db";
import { CameliaBloom, SiteFooter, SiteNav } from "@/components/camelia";

export const Route = createFileRoute("/procedimentos")({
  head: () => ({
    meta: [
      { title: "Procedimentos · Camélia Estética" },
      {
        name: "description",
        content:
          "Limpeza de pele, depilação a laser e massagem modeladora: veja duração, valor e a profissional responsável por cada procedimento da Camélia Estética.",
      },
      { property: "og:title", content: "Procedimentos · Camélia Estética" },
      {
        property: "og:description",
        content:
          "Veja duração, valor e a profissional responsável por cada procedimento da Camélia Estética.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Procedimentos,
});

function Procedimentos() {
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  useEffect(() => {
    popularDadosDeExemplo();
    setProcedimentos(listarProcedimentos());
    setProfissionais(listarProfissionais());
  }, []);

  return (
    <div className="min-h-screen bg-blush font-body text-ink">
      <SiteNav current="procedimentos" />

      <header className="px-6 pt-14 pb-8 md:px-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-serif text-5xl text-ink">Nossos procedimentos</h1>
          <p className="mt-4 max-w-2xl text-ink/60">
            Cada sessão é conduzida por uma profissional dedicada àquele procedimento. Se
            preferir, contrate um pacote e economize nas próximas sessões.
          </p>
        </div>
      </header>

      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {procedimentos.map((p) => {
            const responsavel = profissionais.find((prof) => prof.especialidade === p.nome);
            return (
              <article
                key={p.id}
                className="flex flex-col rounded-3xl border border-rose-petal/70 bg-card p-7 shadow-sm shadow-rose-petal/40 transition-shadow hover:shadow-lg hover:shadow-rose-petal/60"
              >
                <span className="h-11 w-11 rounded-2xl bg-lilac/25 p-2">
                  <CameliaBloom className="h-full w-full" />
                </span>
                <h2 className="mt-4 font-serif text-2xl text-ink">{p.nome}</h2>
                <p className="mt-2 flex-1 text-sm text-ink/55">{p.descricao}</p>
                <dl className="mt-5 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink/50">Duração</dt>
                    <dd className="text-ink">{p.duracao} min</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/50">Valor da sessão</dt>
                    <dd className="font-medium text-orchid">{formatarMoeda(p.preco)}</dd>
                  </div>
                  {responsavel && (
                    <div className="flex justify-between">
                      <dt className="text-ink/50">Profissional</dt>
                      <dd className="text-ink">{responsavel.nome}</dd>
                    </div>
                  )}
                </dl>
                <Link
                  to="/acesso"
                  className="mt-6 rounded-full bg-orchid px-5 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-mauve"
                >
                  Agendar
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-sage-soft/25 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-ink">Pacotes de sessões</h2>
          <p className="mt-3 text-sm text-ink/60">
            Nossa equipe monta o pacote com você na recepção: quantidade de sessões, valor
            total e forma de pagamento. Depois é só agendar cada sessão pelo site — o saldo
            aparece na sua área.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
