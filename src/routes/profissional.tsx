import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  formatarData,
  getSessao,
  limparSessao,
  popularDadosDeExemplo,
  registrarAtendimento,
  visualizarAgenda,
  type SessaoDetalhada,
  type Sessao_Usuario,
} from "@/lib/db";
import {
  AppTopbar,
  Badge,
  Campo,
  Mensagem,
  Panel,
  Vazio,
  inputClass,
} from "@/components/camelia";

export const Route = createFileRoute("/profissional")({
  head: () => ({
    meta: [
      { title: "Minha agenda · Camélia Estética" },
      {
        name: "description",
        content:
          "Área da profissional da Camélia Estética: veja suas sessões do dia e registre o atendimento realizado com observações e produtos usados.",
      },
      { property: "og:title", content: "Minha agenda · Camélia Estética" },
      {
        property: "og:description",
        content: "Veja suas sessões e registre os atendimentos realizados.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AreaProfissional,
});

function AreaProfissional() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Sessao_Usuario | null>(null);
  const [agenda, setAgenda] = useState<SessaoDetalhada[]>([]);
  const [selecionada, setSelecionada] = useState<SessaoDetalhada | null>(null);
  const [observacoes, setObservacoes] = useState("");
  const [produtos, setProdutos] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback((u: Sessao_Usuario) => {
    setAgenda(visualizarAgenda(u));
  }, []);

  useEffect(() => {
    popularDadosDeExemplo();
    const s = getSessao();
    if (!s || s.role !== "profissional") {
      navigate({ to: "/acesso" });
      return;
    }
    setUsuario(s);
    recarregar(s);
  }, [navigate, recarregar]);

  if (!usuario) return null;

  function salvarAtendimento() {
    if (!selecionada || !usuario) return;
    setErro(null);
    try {
      registrarAtendimento(
        { sessaoId: selecionada.id, observacoes, produtosUtilizados: produtos },
        usuario,
      );
      setSelecionada(null);
      setObservacoes("");
      setProdutos("");
      recarregar(usuario);
    } catch (err) {
      setErro((err as Error).message);
    }
  }

  return (
    <div className="min-h-screen bg-blush font-body text-ink">
      <AppTopbar
        subtitulo={`Área do profissional${usuario.especialidade ? ` · ${usuario.especialidade}` : ""}`}
        nome={usuario.nome}
        onSair={() => {
          limparSessao();
          navigate({ to: "/" });
        }}
      />

      <main className="mx-auto max-w-3xl px-6 py-8 md:px-10">
        <Panel titulo="Minha agenda">
          {agenda.length === 0 ? (
            <Vazio>Você não tem sessões na agenda.</Vazio>
          ) : (
            <ul className="space-y-3">
              {agenda.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-petal/60 bg-blush/60 px-4 py-3"
                >
                  <div>
                    <p className="font-serif text-lg text-ink">
                      {formatarData(s.data)} às {s.horario}
                    </p>
                    <p className="text-sm text-ink/55">
                      {s.nomeCliente} · {s.procedimentoNome}
                    </p>
                    <span className="mt-1 inline-block">
                      <Badge status={s.status} />
                    </span>
                  </div>
                  {s.status === "agendada" && (
                    <button
                      onClick={() => {
                        setSelecionada(s);
                        setObservacoes("");
                        setProdutos("");
                        setErro(null);
                      }}
                      className="rounded-full bg-orchid px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-mauve"
                    >
                      Registrar atendimento
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </main>

      {selecionada && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-ink/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl text-ink">Registrar atendimento</h2>
            <p className="mt-1 mb-4 text-sm text-ink/55">
              {selecionada.nomeCliente} · {formatarData(selecionada.data)} às{" "}
              {selecionada.horario} · {selecionada.procedimentoNome}
            </p>
            <Campo label="Observações">
              <input
                className={inputClass}
                placeholder="Ex.: pele reagiu bem ao procedimento"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </Campo>
            <Campo label="Produtos utilizados">
              <input
                className={inputClass}
                placeholder="Ex.: ácido hialurônico, protetor solar"
                value={produtos}
                onChange={(e) => setProdutos(e.target.value)}
              />
            </Campo>
            <Mensagem texto={erro} />
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setSelecionada(null)}
                className="flex-1 rounded-full border border-mauve/50 py-2.5 text-sm text-ink transition-colors hover:bg-rose-petal/50"
              >
                Cancelar
              </button>
              <button
                onClick={salvarAtendimento}
                className="flex-1 rounded-full bg-orchid py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-mauve"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
