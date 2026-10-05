import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, CircleDollarSign, Clock3, PackageCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  buscarClientePorCpf,
  cancelarSessao,
  formatarData,
  formatarMoeda,
  getSessao,
  limparSessao,
  listarProcedimentos,
  meusPacotes,
  popularDadosDeExemplo,
  registrarPagamento,
  relatorioMensal,
  resumoFinanceiro,
  venderPacote,
  visualizarAgenda,
  type PacoteDetalhado,
  type Procedimento,
  type Sessao_Usuario,
  type SessaoDetalhada,
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

export const Route = createFileRoute("/secretaria")({
  head: () => ({
    meta: [
      { title: "Recepção · Camélia Estética" },
      {
        name: "description",
        content:
          "Painel da recepção da Camélia Estética: agenda geral do dia, venda de pacotes, registro de pagamentos e relatório mensal de atendimentos.",
      },
      { property: "og:title", content: "Recepção · Camélia Estética" },
      {
        property: "og:description",
        content: "Agenda geral, venda de pacotes, pagamentos e relatório mensal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AreaSecretaria,
});

function AreaSecretaria() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Sessao_Usuario | null>(null);
  const [agenda, setAgenda] = useState<SessaoDetalhada[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);

  const [cpf, setCpf] = useState("");
  const [cliente, setCliente] = useState<{ id: string; nome: string } | null>(null);
  const [pacotesCliente, setPacotesCliente] = useState<PacoteDetalhado[]>([]);
  const [msgCliente, setMsgCliente] = useState<{
    texto: string;
    tipo: "erro" | "sucesso";
  } | null>(null);

  const [pacote, setPacote] = useState({
    procedimentoNome: "",
    quantidadeSessoes: "",
    valorTotal: "",
    entrada: "",
    formaPagamento: "pix",
  });

  const [pagamento, setPagamento] = useState({
    pacoteId: "",
    valor: "",
    formaPagamento: "pix",
  });

  const [msgAgenda, setMsgAgenda] = useState<{ texto: string; tipo: "erro" | "sucesso" } | null>(null);
  const [msgFin, setMsgFin] = useState<{ texto: string; tipo: "erro" | "sucesso" } | null>(null);
  const [mesFin, setMesFin] = useState(new Date().toISOString().slice(0, 7));
  const [versaoFin, setVersaoFin] = useState(0);
  const [mes, setMes] = useState(new Date().toISOString().slice(0, 7));
  const [relatorio, setRelatorio] = useState<ReturnType<typeof relatorioMensal> | null>(null);

  const recarregarAgenda = useCallback((u: Sessao_Usuario) => {
    setAgenda(visualizarAgenda(u));
  }, []);

  useEffect(() => {
    popularDadosDeExemplo();
    const s = getSessao();
    if (!s || s.role !== "secretaria") {
      navigate({ to: "/acesso" });
      return;
    }
    setUsuario(s);
    setProcedimentos(listarProcedimentos());
    recarregarAgenda(s);
  }, [navigate, recarregarAgenda]);

  if (!usuario) return null;
  void versaoFin;
  const fin = resumoFinanceiro(mesFin);

  function buscar() {
    setMsgCliente(null);
    setCliente(null);
    setPacotesCliente([]);
    try {
      const encontrado = buscarClientePorCpf(cpf.trim());
      setCliente(encontrado);
      setPacotesCliente(meusPacotes(encontrado.id));
    } catch (err) {
      setMsgCliente({ texto: (err as Error).message, tipo: "erro" });
    }
  }

  function vender() {
    if (!cliente) return;
    setMsgCliente(null);
    try {
      venderPacote({
        clienteId: cliente.id,
        procedimentoNome: pacote.procedimentoNome,
        quantidadeSessoes: pacote.quantidadeSessoes,
        valorTotal: pacote.valorTotal,
        ...(pacote.entrada
          ? {
              pagamentoInicial: {
                valor: Number(pacote.entrada),
                formaPagamento: pacote.formaPagamento,
                data: new Date().toISOString().slice(0, 10),
              },
            }
          : {}),
      });

      setMsgCliente({ texto: "Pacote cadastrado com sucesso.", tipo: "sucesso" });
      setPacote({
        procedimentoNome: "",
        quantidadeSessoes: "",
        valorTotal: "",
        entrada: "",
        formaPagamento: "pix",
      });
      setPacotesCliente(meusPacotes(cliente.id));
      setVersaoFin((v) => v + 1);
    } catch (err) {
      setMsgCliente({ texto: (err as Error).message, tipo: "erro" });
    }
  }

  function pagar() {
    setMsgFin(null);
    try {
      registrarPagamento({
        pacoteId: pagamento.pacoteId,
        valor: Number(pagamento.valor),
        formaPagamento: pagamento.formaPagamento,
        data: new Date().toISOString().slice(0, 10),
      });
      setMsgFin({ texto: "Pagamento registrado.", tipo: "sucesso" });
      setPagamento({ pacoteId: "", valor: "", formaPagamento: "pix" });
      setVersaoFin((v) => v + 1);
      if (cliente) setPacotesCliente(meusPacotes(cliente.id));
    } catch (err) {
      setMsgFin({ texto: (err as Error).message, tipo: "erro" });
    }
  }

  return (
    <AppShell
        role="secretaria"
        subtitulo="Agenda, clientes e recebimentos"
        nome={usuario.nome}
        onSair={() => {
          limparSessao();
          navigate({ to: "/" });
        }}
      >
        <PageHeading
          eyebrow="Visão da recepção"
          title="Organização do dia"
          description="Acompanhe a agenda e acesse rapidamente as rotinas de clientes e pagamentos."
        />

        <div className="mb-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Na agenda" value={agenda.length} icon={<CalendarDays className="h-4 w-4" />} />
          <StatCard label="Aguardando" value={agenda.filter((s) => s.status === "agendada").length} icon={<Clock3 className="h-4 w-4" />} />
          <StatCard label="Realizados" value={agenda.filter((s) => s.status === "realizada").length} icon={<PackageCheck className="h-4 w-4" />} />
          <StatCard label="A receber" value={formatarMoeda(fin.aReceber)} detail={`${fin.emAberto.length} pacote(s) em aberto`} icon={<CircleDollarSign className="h-4 w-4" />} />
        </div>

        <section id="agenda" className="mb-6">
        <Panel titulo="Agenda geral" acao={<span className="text-xs text-ink/40">Todos os profissionais</span>}>
          {agenda.length === 0 ? (
            <Vazio>Nenhuma sessão ativa na agenda.</Vazio>
          ) : (
             <ul className="max-h-[30rem] divide-y divide-rose-petal/55 overflow-y-auto pr-1">
              {agenda.map((s) => (
                <li
                  key={s.id}
                   className="grid gap-3 py-4 md:grid-cols-[7rem_1fr_auto] md:items-center"
                >
                   <p className="font-serif text-lg text-sage-deep">{s.horario}</p>
                  <div>
                     <p className="font-medium text-ink">{s.nomeCliente}</p>
                    <p className="text-sm text-ink/55">
                       {s.procedimentoNome} · {s.nomeProfissional} · {formatarData(s.data)}
                    </p>
                    <span className="mt-1 inline-block">
                      <Badge status={s.status} />
                    </span>
                  </div>
                  {s.status === "agendada" && (
                     <Button
                       variant="ghost"
                       size="sm"
                      onClick={() => {
                        if (!window.confirm(`Cancelar a sessão de ${s.nomeCliente} em ${formatarData(s.data)} às ${s.horario}?`)) return;
                        setMsgAgenda(null);
                        try {
                           cancelarSessao(s.id, usuario);
                           recarregarAgenda(usuario);
                           setVersaoFin((v) => v + 1);
                           setMsgAgenda({ texto: "Sessão cancelada. Se era de pacote, o saldo foi devolvido.", tipo: "sucesso" });
                        } catch (err) {
                          setMsgAgenda({ texto: (err as Error).message, tipo: "erro" });
                        }
                      }}
                       className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Cancelar
                     </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {msgAgenda && <Mensagem texto={msgAgenda.texto} tipo={msgAgenda.tipo} />}
        </Panel>
        </section>


        <section id="financeiro" className="mb-6 scroll-mt-6">
          <Panel titulo="Financeiro" acao={
            <input className={`${inputClass} w-auto`} type="month" value={mesFin} onChange={(e) => setMesFin(e.target.value)} aria-label="Mês" />
          }>
            <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Recebido no mês" value={formatarMoeda(fin.recebidoNoMes)} detail={`${fin.qtdPagamentosMes} pagamento(s)`} icon={<CircleDollarSign className="h-4 w-4" />} />
              <StatCard label="A receber" value={formatarMoeda(fin.aReceber)} detail="Saldo de todos os pacotes" icon={<Clock3 className="h-4 w-4" />} />
              <StatCard label="Total vendido" value={formatarMoeda(fin.totalVendido)} detail={`${fin.pacotes.length} pacote(s)`} icon={<PackageCheck className="h-4 w-4" />} />
              <StatCard label="Em aberto" value={fin.emAberto.length} detail="Pacotes com saldo devedor" icon={<CalendarDays className="h-4 w-4" />} />
            </div>

            <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_1fr]">
              <div>
                <h3 className="mb-3 font-serif text-xl text-ink">Pacotes com valor em aberto</h3>
                {fin.emAberto.length === 0 ? (
                  <Vazio>Todos os pacotes estão quitados.</Vazio>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {fin.emAberto.map((p) => {
                      const pct = p.valorTotal ? Math.round((p.valorPago / p.valorTotal) * 100) : 0;
                      return (
                        <li key={p.id} className="rounded-lg border border-rose-petal/60 bg-blush/40 px-4 py-3">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-ink">{p.nomeCliente}</p>
                              <p className="text-ink/55">{p.procedimentoNome} · {p.saldoSessoes} de {p.quantidadeSessoes} sessões</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => { setPagamento({ ...pagamento, pacoteId: p.id, valor: String(p.saldoDevedor) }); setMsgFin(null); }}>
                              Receber
                            </Button>
                          </div>
                          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rose-petal/50">
                            <div className="h-full rounded-full bg-sage" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="mt-1.5 flex justify-between text-xs text-ink/55">
                            <span>{formatarMoeda(p.valorPago)} pagos de {formatarMoeda(p.valorTotal)}</span>
                            <span className="text-destructive">falta {formatarMoeda(p.saldoDevedor)}</span>
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="mb-3 font-serif text-xl text-ink">Registrar pagamento</h3>
                <Campo label="Pacote">
                  <select className={inputClass} value={pagamento.pacoteId} onChange={(e) => setPagamento({ ...pagamento, pacoteId: e.target.value })}>
                    <option value="">Selecione</option>
                    {fin.emAberto.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nomeCliente} · {p.procedimentoNome} — falta {formatarMoeda(p.saldoDevedor)}
                      </option>
                    ))}
                  </select>
                </Campo>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Valor (R$)">
                    <input className={inputClass} type="number" min="0" step="0.01" value={pagamento.valor} onChange={(e) => setPagamento({ ...pagamento, valor: e.target.value })} />
                  </Campo>
                  <Campo label="Forma">
                    <select className={inputClass} value={pagamento.formaPagamento} onChange={(e) => setPagamento({ ...pagamento, formaPagamento: e.target.value })}>
                      <option value="pix">Pix</option>
                      <option value="cartão">Cartão</option>
                      <option value="dinheiro">Dinheiro</option>
                    </select>
                  </Campo>
                </div>
                <Button onClick={pagar} className="w-full bg-sage-deep text-primary-foreground hover:bg-sage-deep/90">
                  Registrar pagamento
                </Button>
                {msgFin && <Mensagem texto={msgFin.texto} tipo={msgFin.tipo} />}

                <h3 className="mt-8 mb-3 font-serif text-xl text-ink">Últimos pagamentos</h3>
                {fin.pagamentos.length === 0 ? (
                  <Vazio>Nenhum pagamento registrado.</Vazio>
                ) : (
                  <ul className="max-h-72 divide-y divide-rose-petal/55 overflow-y-auto text-sm">
                    {fin.pagamentos.slice(0, 20).map((pg) => (
                      <li key={pg.id} className="flex items-center justify-between gap-3 py-2.5">
                        <div>
                          <p className="text-ink">{pg.nomeCliente}</p>
                          <p className="text-xs text-ink/50">{pg.procedimentoNome} · {formatarData(pg.data)} · {pg.formaPagamento}</p>
                        </div>
                        <span className="font-medium text-sage-deep">{formatarMoeda(pg.valor)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Panel>
        </section>
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <section id="pacotes" className="scroll-mt-6">
          <Panel titulo="Clientes e pacotes">
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="CPF do cliente"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <Button
                onClick={buscar}
                className="shrink-0"
              >
                Buscar
              </Button>
            </div>

            {cliente && (
              <>
                 <p className="mt-4 rounded-lg border border-lilac/30 bg-lilac/10 px-4 py-3 text-sm text-ink">
                  Cliente selecionada: <strong>{cliente.nome}</strong>
                </p>

                <h3 className="mt-6 mb-3 font-serif text-xl text-ink">Vender pacote</h3>
                <Campo label="Procedimento">
                  <select
                    className={inputClass}
                    value={pacote.procedimentoNome}
                    onChange={(e) =>
                      setPacote({ ...pacote, procedimentoNome: e.target.value })
                    }
                  >
                    <option value="">Selecione</option>
                    {procedimentos.map((p) => (
                      <option key={p.id} value={p.nome}>
                        {p.nome}
                      </option>
                    ))}
                  </select>
                </Campo>
                <div className="grid grid-cols-2 gap-3">
                  <Campo label="Sessões">
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      value={pacote.quantidadeSessoes}
                      onChange={(e) =>
                        setPacote({ ...pacote, quantidadeSessoes: e.target.value })
                      }
                    />
                  </Campo>
                  <Campo label="Valor total (R$)">
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      value={pacote.valorTotal}
                      onChange={(e) => setPacote({ ...pacote, valorTotal: e.target.value })}
                    />
                  </Campo>
                  <Campo label="Entrada (R$)">
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      value={pacote.entrada}
                      onChange={(e) => setPacote({ ...pacote, entrada: e.target.value })}
                    />
                  </Campo>
                  <Campo label="Forma de pagamento">
                    <select
                      className={inputClass}
                      value={pacote.formaPagamento}
                      onChange={(e) =>
                        setPacote({ ...pacote, formaPagamento: e.target.value })
                      }
                    >
                      <option value="pix">Pix</option>
                      <option value="cartão">Cartão</option>
                      <option value="dinheiro">Dinheiro</option>
                    </select>
                  </Campo>
                </div>
                 <Button
                  onClick={vender}
                   className="w-full bg-sage-deep text-primary-foreground hover:bg-sage-deep/90"
                >
                  Cadastrar pacote
                 </Button>

                <h3 className="mt-8 mb-3 font-serif text-xl text-ink">
                  Pacotes desta cliente
                </h3>
                {pacotesCliente.length === 0 ? (
                  <Vazio>Nenhum pacote cadastrado.</Vazio>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {pacotesCliente.map((p) => (
                      <li
                        key={p.id}
                         className="rounded-lg border border-rose-petal/60 bg-blush/40 px-4 py-3"
                      >
                        <p className="text-ink">{p.procedimentoNome}</p>
                        <p className="text-ink/55">
                          {p.saldoSessoes} de {p.quantidadeSessoes} sessões ·{" "}
                          {formatarMoeda(p.valorPago)} pagos de{" "}
                          {formatarMoeda(p.valorTotal)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}

              </>
            )}

            {msgCliente && <Mensagem texto={msgCliente.texto} tipo={msgCliente.tipo} />}
          </Panel>
          </section>

          <section>
          <Panel titulo="Relatório mensal">
            <div className="flex gap-2">
              <input
                className={inputClass}
                type="month"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              />
              <Button
                onClick={() => setRelatorio(relatorioMensal(mes))}
                className="shrink-0"
              >
                Gerar
              </Button>
            </div>
            {relatorio && (
              <div className="mt-4">
                {relatorio.mensagem ? (
                  <Vazio>{relatorio.mensagem}</Vazio>
                ) : (
                  <>
                    <p className="font-serif text-3xl text-orchid">
                      {relatorio.totalAtendimentos}
                    </p>
                    <p className="mb-3 text-xs text-ink/55">
                      atendimentos realizados em {relatorio.mes}
                    </p>
                    <ul className="space-y-1 text-sm">
                      {Object.entries(relatorio.porProcedimento).map(([nome, qtd]) => (
                        <li
                          key={nome}
                          className="flex justify-between rounded-lg bg-blush/70 px-4 py-2"
                        >
                          <span className="text-ink/70">{nome}</span>
                          <span className="text-ink">{qtd}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </Panel>
          </section>
        </div>
    </AppShell>
  );
}
