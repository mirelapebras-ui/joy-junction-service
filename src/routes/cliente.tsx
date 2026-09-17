import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  agendarSessaoAvulsa,
  agendarSessaoDePacote,
  cancelarSessao,
  consultarDisponibilidade,
  formatarData,
  formatarMoeda,
  getSessao,
  limparSessao,
  listarProcedimentos,
  meusPacotes,
  minhasSessoes,
  pacotesComSaldo,
  popularDadosDeExemplo,
  remarcarSessao,
  type DisponibilidadeProfissional,
  type PacoteDetalhado,
  type Procedimento,
  type Sessao_Usuario,
  type SessaoDetalhada,
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
import { ListaDisponibilidade } from "@/components/disponibilidade";

export const Route = createFileRoute("/cliente")({
  head: () => ({
    meta: [
      { title: "Minha área · Camélia Estética" },
      {
        name: "description",
        content:
          "Área da cliente da Camélia Estética: agende sessões avulsas ou de pacote, remarque, cancele e acompanhe o saldo dos seus pacotes.",
      },
      { property: "og:title", content: "Minha área · Camélia Estética" },
      {
        property: "og:description",
        content: "Agende, remarque e acompanhe seus pacotes na Camélia Estética.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AreaCliente,
});

type Escolha = { profissionalId: string; data: string; horario: string };

function AreaCliente() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Sessao_Usuario | null>(null);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [sessoes, setSessoes] = useState<SessaoDetalhada[]>([]);
  const [pacotes, setPacotes] = useState<PacoteDetalhado[]>([]);
  const [comSaldo, setComSaldo] = useState<PacoteDetalhado[]>([]);

  const [modo, setModo] = useState<"avulsa" | "pacote">("avulsa");
  const [procedimentoNome, setProcedimentoNome] = useState("");
  const [pacoteId, setPacoteId] = useState("");
  const [disponibilidade, setDisponibilidade] = useState<
    DisponibilidadeProfissional[] | null
  >(null);
  const [escolha, setEscolha] = useState<Escolha | null>(null);
  const [msg, setMsg] = useState<{ texto: string; tipo: "erro" | "sucesso" } | null>(null);

  const [remarcando, setRemarcando] = useState<SessaoDetalhada | null>(null);
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [msgRemarcar, setMsgRemarcar] = useState<string | null>(null);

  const recarregar = useCallback((u: Sessao_Usuario) => {
    setSessoes(minhasSessoes(u.id));
    setPacotes(meusPacotes(u.id));
    setComSaldo(pacotesComSaldo(u.id));
  }, []);

  useEffect(() => {
    popularDadosDeExemplo();
    const s = getSessao();
    if (!s || s.role !== "cliente") {
      navigate({ to: "/acesso" });
      return;
    }
    setUsuario(s);
    setProcedimentos(listarProcedimentos());
    recarregar(s);
  }, [navigate, recarregar]);

  if (!usuario) return null;

  function buscarHorarios() {
    setMsg(null);
    setEscolha(null);
    setDisponibilidade(null);
    try {
      const nome =
        modo === "avulsa"
          ? procedimentoNome
          : comSaldo.find((p) => p.id === pacoteId)?.procedimentoNome;
      if (!nome) {
        setMsg({ texto: "Escolha um procedimento para ver os horários.", tipo: "erro" });
        return;
      }
      setDisponibilidade(consultarDisponibilidade({ procedimentoNome: nome }));
    } catch (err) {
      setMsg({ texto: (err as Error).message, tipo: "erro" });
    }
  }

  function confirmar() {
    if (!escolha || !usuario) return;
    setMsg(null);
    try {
      if (modo === "avulsa") {
        agendarSessaoAvulsa({
          clienteId: usuario.id,
          procedimentoNome,
          profissionalId: escolha.profissionalId,
          data: escolha.data,
          horario: escolha.horario,
        });
      } else {
        agendarSessaoDePacote({
          pacoteId,
          profissionalId: escolha.profissionalId,
          data: escolha.data,
          horario: escolha.horario,
        });
      }
      setMsg({
        texto: `Sessão confirmada para ${formatarData(escolha.data)} às ${escolha.horario}.`,
        tipo: "sucesso",
      });
      setEscolha(null);
      setDisponibilidade(null);
      recarregar(usuario);
    } catch (err) {
      setMsg({ texto: (err as Error).message, tipo: "erro" });
    }
  }

  function cancelar(id: string) {
    setMsg(null);
    try {
      cancelarSessao(id, usuario!);
      setMsg({ texto: "Sessão cancelada.", tipo: "sucesso" });
      recarregar(usuario!);
    } catch (err) {
      setMsg({ texto: (err as Error).message, tipo: "erro" });
    }
  }

  function salvarRemarcacao() {
    if (!remarcando) return;
    setMsgRemarcar(null);
    try {
      remarcarSessao(remarcando.id, { novaData, novoHorario }, usuario!);
      setRemarcando(null);
      setMsg({ texto: "Sessão remarcada com sucesso.", tipo: "sucesso" });
      recarregar(usuario!);
    } catch (err) {
      setMsgRemarcar((err as Error).message);
    }
  }

  return (
    <div className="min-h-screen bg-blush font-body text-ink">
      <AppTopbar
        subtitulo="Minha área"
        nome={usuario.nome}
        onSair={() => {
          limparSessao();
          navigate({ to: "/" });
        }}
      />

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 md:px-10 lg:grid-cols-2">
        <Panel titulo="Agendar sessão">
          <div className="mb-4 flex rounded-full bg-blush p-1">
            {(["avulsa", "pacote"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setModo(m);
                  setDisponibilidade(null);
                  setEscolha(null);
                  setMsg(null);
                }}
                className={`flex-1 rounded-full py-2 text-sm transition-colors ${
                  modo === m ? "bg-orchid text-primary-foreground" : "text-ink/60"
                }`}
              >
                {m === "avulsa" ? "Sessão avulsa" : "Usar pacote"}
              </button>
            ))}
          </div>

          {modo === "avulsa" ? (
            <Campo label="Procedimento">
              <select
                className={inputClass}
                value={procedimentoNome}
                onChange={(e) => {
                  setProcedimentoNome(e.target.value);
                  setDisponibilidade(null);
                }}
              >
                <option value="">Selecione</option>
                {procedimentos.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.nome} — {formatarMoeda(p.preco)}
                  </option>
                ))}
              </select>
            </Campo>
          ) : (
            <Campo label="Pacote com saldo">
              <select
                className={inputClass}
                value={pacoteId}
                onChange={(e) => {
                  setPacoteId(e.target.value);
                  setDisponibilidade(null);
                }}
              >
                <option value="">Selecione</option>
                {comSaldo.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.procedimentoNome} — {p.saldoSessoes} sessões restantes
                  </option>
                ))}
              </select>
            </Campo>
          )}

          <button
            onClick={buscarHorarios}
            className="mt-1 w-full rounded-full bg-rose-petal py-2.5 text-sm font-medium text-ink transition-colors hover:bg-petal/60"
          >
            Ver horários disponíveis
          </button>

          {disponibilidade && (
            <div className="mt-5">
              <ListaDisponibilidade
                resultado={disponibilidade}
                onSelect={(profissionalId, data, horario) =>
                  setEscolha({ profissionalId, data, horario })
                }
              />
            </div>
          )}

          {escolha && (
            <div className="mt-5 rounded-2xl bg-lilac/15 px-4 py-4">
              <p className="text-sm text-ink/70">
                Horário selecionado:{" "}
                <strong className="text-ink">
                  {formatarData(escolha.data)} às {escolha.horario}
                </strong>
              </p>
              <button
                onClick={confirmar}
                className="mt-3 w-full rounded-full bg-orchid py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-mauve"
              >
                Confirmar agendamento
              </button>
            </div>
          )}

          {msg && <Mensagem texto={msg.texto} tipo={msg.tipo} />}
        </Panel>

        <div className="space-y-6">
          <Panel titulo="Minhas sessões">
            {sessoes.length === 0 ? (
              <Vazio>Você ainda não tem sessões agendadas.</Vazio>
            ) : (
              <ul className="space-y-3">
                {sessoes.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-petal/60 bg-blush/60 px-4 py-3"
                  >
                    <div>
                      <p className="font-serif text-lg text-ink">
                        {formatarData(s.data)} às {s.horario}
                      </p>
                      <p className="text-sm text-ink/55">
                        {s.procedimentoNome} · {s.nomeProfissional}
                        {s.pacoteId ? " · pacote" : ""}
                      </p>
                      <span className="mt-1 inline-block">
                        <Badge status={s.status} />
                      </span>
                    </div>
                    {s.status === "agendada" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setRemarcando(s);
                            setNovaData(s.data);
                            setNovoHorario(s.horario);
                            setMsgRemarcar(null);
                          }}
                          className="rounded-full border border-mauve/50 px-3 py-1.5 text-xs text-ink transition-colors hover:bg-rose-petal/60"
                        >
                          Remarcar
                        </button>
                        <button
                          onClick={() => cancelar(s.id)}
                          className="rounded-full border border-destructive/40 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-ink/45">
              Cancelamentos e remarcações são permitidos com no mínimo 2 horas de antecedência.
            </p>
          </Panel>

          <Panel titulo="Meus pacotes">
            {pacotes.length === 0 ? (
              <Vazio>Você ainda não tem pacotes contratados.</Vazio>
            ) : (
              <ul className="space-y-3">
                {pacotes.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-2xl border border-rose-petal/60 bg-blush/60 px-4 py-3"
                  >
                    <p className="font-serif text-lg text-ink">{p.procedimentoNome}</p>
                    <div className="mt-1 grid grid-cols-2 gap-1 text-sm text-ink/60">
                      <span>
                        Sessões: {p.saldoSessoes} de {p.quantidadeSessoes}
                      </span>
                      <span>Total: {formatarMoeda(p.valorTotal)}</span>
                      <span>Pago: {formatarMoeda(p.valorPago)}</span>
                      <span
                        className={p.saldoDevedor > 0 ? "text-destructive" : "text-sage-deep"}
                      >
                        {p.saldoDevedor > 0
                          ? `A pagar: ${formatarMoeda(p.saldoDevedor)}`
                          : "Quitado"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </main>

      {remarcando && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-ink/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl">
            <h2 className="font-serif text-2xl text-ink">Remarcar sessão</h2>
            <p className="mt-1 mb-4 text-sm text-ink/55">
              {remarcando.procedimentoNome} · atualmente {formatarData(remarcando.data)} às{" "}
              {remarcando.horario}
            </p>
            <Campo label="Nova data">
              <input
                className={inputClass}
                type="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
              />
            </Campo>
            <Campo label="Novo horário">
              <select
                className={inputClass}
                value={novoHorario}
                onChange={(e) => setNovoHorario(e.target.value)}
              >
                {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </Campo>
            <Mensagem texto={msgRemarcar} />
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setRemarcando(null)}
                className="flex-1 rounded-full border border-mauve/50 py-2.5 text-sm text-ink transition-colors hover:bg-rose-petal/50"
              >
                Voltar
              </button>
              <button
                onClick={salvarRemarcacao}
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
