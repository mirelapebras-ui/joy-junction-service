import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Clock3 } from "lucide-react";
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
  AppShell,
  Badge,
  Campo,
  Mensagem,
  PageHeading,
  Panel,
  StatCard,
  Vazio,
  inputClass,
} from "@/components/camelia";
import { Button } from "@/components/ui/button";

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
    <AppShell
        role="profissional"
        subtitulo={usuario.especialidade ?? "Agenda de atendimentos"}
        nome={usuario.nome}
        onSair={() => {
          limparSessao();
          navigate({ to: "/" });
        }}
      >
        <PageHeading
          eyebrow="Agenda profissional"
          title="Atendimentos do dia"
          description="Acompanhe a sequência dos atendimentos e registre cada sessão concluída."
        />

        <div className="mb-7 grid gap-3 sm:grid-cols-3">
          <StatCard label="Total na agenda" value={agenda.length} icon={<CalendarDays className="h-4 w-4" />} />
          <StatCard label="Aguardando" value={agenda.filter((s) => s.status === "agendada").length} icon={<Clock3 className="h-4 w-4" />} />
          <StatCard label="Concluídos" value={agenda.filter((s) => s.status === "realizada").length} icon={<CheckCircle2 className="h-4 w-4" />} />
        </div>

        <Panel titulo="Minha agenda" acao={<span className="text-xs text-ink/40">{usuario.especialidade}</span>}>
          {agenda.length === 0 ? (
            <Vazio>Você não tem sessões na agenda.</Vazio>
          ) : (
            <ul className="relative space-y-0 before:absolute before:top-6 before:bottom-6 before:left-[4.55rem] before:w-px before:bg-rose-petal">
              {agenda.map((s) => (
                <li
                  key={s.id}
                  className="relative grid gap-4 border-b border-rose-petal/55 py-5 last:border-0 md:grid-cols-[4rem_1fr_auto] md:items-center"
                >
                  <div className="relative z-10 w-fit bg-card pr-3 text-sm font-semibold text-sage-deep">{s.horario}</div>
                  <div>
                    <p className="font-medium text-ink">{s.nomeCliente}</p>
                    <p className="text-sm text-ink/55">
                      {s.procedimentoNome} · {formatarData(s.data)}
                    </p>
                    <span className="mt-1 inline-block">
                      <Badge status={s.status} />
                    </span>
                  </div>
                  {s.status === "agendada" && (
                    <Button
                      onClick={() => {
                        setSelecionada(s);
                        setObservacoes("");
                        setProdutos("");
                        setErro(null);
                      }}
                      size="sm"
                      className="bg-sage-deep text-primary-foreground hover:bg-sage-deep/90"
                    >
                      Registrar atendimento
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

      {selecionada && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-ink/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl">
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
              <Button
                variant="outline"
                onClick={() => setSelecionada(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarAtendimento}
                className="flex-1 bg-sage-deep text-primary-foreground hover:bg-sage-deep/90"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
