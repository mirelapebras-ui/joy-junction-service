// ===========================================================
// "Banco de dados" no navegador — tudo guardado em localStorage.
// Portado do protótipo original (js/db.js), mesmas regras de negócio.
// ===========================================================

export type Role = "cliente" | "secretaria" | "profissional";

export interface Procedimento {
  id: string;
  nome: string;
  duracao: number;
  preco: number;
  descricao: string;
}
export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  senha?: string;
}
export interface Secretaria {
  id: string;
  nome: string;
  login: string;
  senha?: string;
}
export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  senha?: string;
}
export type StatusSessao = "agendada" | "cancelada" | "realizada";
export interface Sessao {
  id: string;
  clienteId: string;
  profissionalId: string;
  pacoteId: string | null;
  data: string;
  horario: string;
  procedimentoNome: string;
  status: StatusSessao;
}
export interface Pacote {
  id: string;
  clienteId: string;
  procedimentoNome: string;
  quantidadeSessoes: number;
  saldoSessoes: number;
  valorTotal: number;
  valorPago: number;
}
export interface Pagamento {
  id: string;
  pacoteId: string;
  valor: number;
  formaPagamento: string;
  data: string;
}
export interface Atendimento {
  id: string;
  sessaoId: string;
  observacoes: string;
  produtosUtilizados: string;
}

export interface Sessao_Usuario {
  id: string;
  nome: string;
  role: Role;
  especialidade?: string;
}

const CHAVES = {
  clientes: "sae_db_clientes",
  profissionais: "sae_db_profissionais",
  secretarias: "sae_db_secretarias",
  procedimentos: "sae_db_procedimentos",
  sessoes: "sae_db_sessoes",
  pacotes: "sae_db_pacotes",
  pagamentos: "sae_db_pagamentos",
  atendimentos: "sae_db_atendimentos",
} as const;

function temStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function lerColecao<T>(chave: string): T[] {
  if (!temStorage()) return [];
  const raw = localStorage.getItem(chave);
  return raw ? (JSON.parse(raw) as T[]) : [];
}
function salvarColecao<T>(chave: string, lista: T[]) {
  if (!temStorage()) return;
  localStorage.setItem(chave, JSON.stringify(lista));
}
function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---------------------------------------------------------
// Seed inicial — roda uma vez só, se o navegador ainda não tem dados
// ---------------------------------------------------------
export function popularDadosDeExemplo() {
  if (!temStorage()) return;
  if (lerColecao<Profissional>(CHAVES.profissionais).length > 0) return;

  const procedimentos: Procedimento[] = [
    {
      id: gerarId(),
      nome: "Limpeza de Pele",
      duracao: 60,
      preco: 150,
      descricao:
        "Higienização profunda, extração e máscara calmante para uma pele lisa e iluminada.",
    },
    {
      id: gerarId(),
      nome: "Depilação a Laser",
      duracao: 40,
      preco: 200,
      descricao:
        "Redução progressiva dos pelos com aparelho de última geração e conforto térmico.",
    },
    {
      id: gerarId(),
      nome: "Massagem Modeladora",
      duracao: 50,
      preco: 180,
      descricao:
        "Manobras firmes que ajudam a definir o contorno corporal e melhorar a circulação.",
    },
  ];
  salvarColecao(CHAVES.procedimentos, procedimentos);

  const profissionais: Profissional[] = [
    { id: gerarId(), nome: "Bianca Rocha", especialidade: "Limpeza de Pele", senha: "123456" },
    { id: gerarId(), nome: "Rafael Souza", especialidade: "Depilação a Laser", senha: "123456" },
    { id: gerarId(), nome: "Camila Duarte", especialidade: "Massagem Modeladora", senha: "123456" },
  ];
  salvarColecao(CHAVES.profissionais, profissionais);

  const secretarias: Secretaria[] = [
    { id: gerarId(), nome: "Fernanda Lima", login: "secretaria", senha: "123456" },
  ];
  salvarColecao(CHAVES.secretarias, secretarias);

  const clientes: Cliente[] = [
    {
      id: gerarId(),
      nome: "Ana Paula Ribeiro",
      cpf: "111.111.111-11",
      dataNascimento: "1994-03-10",
      telefone: "(15) 99111-2233",
      senha: "123456",
    },
    {
      id: gerarId(),
      nome: "Júlia Martins",
      cpf: "222.222.222-22",
      dataNascimento: "1998-07-22",
      telefone: "(15) 99222-3344",
      senha: "123456",
    },
  ];
  salvarColecao(CHAVES.clientes, clientes);

  // Exemplos para a demonstração: uma sessão futura e um pacote em andamento
  const dias = proximosDiasUteis(3);
  const ana = clientes[0]!;
  const pacoteExemplo: Pacote = {
    id: gerarId(),
    clienteId: ana.id,
    procedimentoNome: "Depilação a Laser",
    quantidadeSessoes: 6,
    saldoSessoes: 5,
    valorTotal: 1080,
    valorPago: 400,
  };
  salvarColecao(CHAVES.sessoes, [
    {
      id: gerarId(),
      clienteId: ana.id,
      profissionalId: profissionais[0]!.id,
      procedimentoNome: "Limpeza de Pele",
      data: dias[0]!,
      horario: "09:00",
      status: "agendada",
      pacoteId: null,
    },
    {
      id: gerarId(),
      clienteId: clientes[1]!.id,
      profissionalId: profissionais[2]!.id,
      procedimentoNome: "Massagem Modeladora",
      data: dias[1]!,
      horario: "15:00",
      status: "agendada",
      pacoteId: null,
    },
    {
      id: gerarId(),
      clienteId: ana.id,
      profissionalId: profissionais[1]!.id,
      procedimentoNome: "Depilação a Laser",
      data: dias[2]!,
      horario: "10:30",
      status: "agendada",
      pacoteId: pacoteExemplo.id,
    },
  ] as Sessao[]);
  salvarColecao(CHAVES.pacotes, [pacoteExemplo]);
  salvarColecao(CHAVES.pagamentos, [
    {
      id: gerarId(),
      pacoteId: pacoteExemplo.id,
      valor: 400,
      formaPagamento: "pix",
      data: new Date().toISOString().slice(0, 10),
    },
  ] as Pagamento[]);
  salvarColecao(CHAVES.atendimentos, []);

}

const HORARIOS_DIA = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

function proximosDiasUteis(qtd: number) {
  const dias: string[] = [];
  let cursor = new Date();
  while (dias.length < qtd) {
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
    const diaSemana = cursor.getDay();
    if (diaSemana !== 0 && diaSemana !== 6) dias.push(cursor.toISOString().slice(0, 10));
  }
  return dias;
}
function horasAte(data: string, horario: string) {
  const alvo = new Date(`${data}T${horario}:00`);
  return (alvo.getTime() - Date.now()) / (1000 * 60 * 60);
}

// RF01 — Cadastrar Cliente · Regra: CPF não pode se repetir
export function cadastrarCliente(dados: {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  senha: string;
}): Sessao_Usuario {
  const { nome, cpf, dataNascimento, telefone, senha } = dados;
  if (!nome || !cpf || !dataNascimento || !telefone || !senha) {
    throw new Error("Preencha todos os campos: nome, CPF, data de nascimento, telefone e senha.");
  }
  const clientes = lerColecao<Cliente>(CHAVES.clientes);
  if (clientes.some((c) => c.cpf === cpf))
    throw new Error("Já existe um cliente cadastrado com este CPF.");

  const novo: Cliente = { id: gerarId(), nome, cpf, dataNascimento, telefone, senha };
  clientes.push(novo);
  salvarColecao(CHAVES.clientes, clientes);
  return { id: novo.id, nome: novo.nome, role: "cliente" };
}

// RF02 — Autenticar Usuário
export function login({
  cpfOuLogin,
  senha,
  role,
}: {
  cpfOuLogin: string;
  senha: string;
  role: Role;
}): Sessao_Usuario {
  let lista: Array<Record<string, unknown>>;
  let campo: string;
  if (role === "cliente") {
    lista = lerColecao<Cliente>(CHAVES.clientes) as unknown as Array<Record<string, unknown>>;
    campo = "cpf";
  } else if (role === "secretaria") {
    lista = lerColecao<Secretaria>(CHAVES.secretarias) as unknown as Array<Record<string, unknown>>;
    campo = "login";
  } else {
    lista = lerColecao<Profissional>(CHAVES.profissionais) as unknown as Array<
      Record<string, unknown>
    >;
    campo = "nome";
  }

  const encontrado = lista.find((u) => u[campo] === cpfOuLogin && u["senha"] === senha);
  if (!encontrado) throw new Error("Credenciais inválidas. Verifique login/CPF e senha.");

  const base: Sessao_Usuario = {
    id: String(encontrado["id"]),
    nome: String(encontrado["nome"]),
    role,
  };
  if (encontrado["especialidade"]) base.especialidade = String(encontrado["especialidade"]);
  return base;

}

export function listarProfissionais(): Profissional[] {
  return lerColecao<Profissional>(CHAVES.profissionais).map(({ senha: _s, ...resto }) => resto);
}
export function listarProcedimentos(): Procedimento[] {
  return lerColecao<Procedimento>(CHAVES.procedimentos);
}

export interface DisponibilidadeProfissional {
  profissionalId: string;
  nomeProfissional: string;
  especialidade: string;
  disponibilidade: Array<{ data: string; horarios: string[] }>;
}

// RF03 — Consultar Disponibilidade de Horário
export function consultarDisponibilidade({
  procedimentoNome,
  profissionalId,
}: {
  procedimentoNome?: string;
  profissionalId?: string;
}): DisponibilidadeProfissional[] {
  let profissionais = listarProfissionais();
  if (procedimentoNome)
    profissionais = profissionais.filter((p) => p.especialidade === procedimentoNome);
  if (profissionalId) profissionais = profissionais.filter((p) => p.id === profissionalId);
  if (profissionais.length === 0)
    throw new Error("Não há profissional disponível para este procedimento no momento.");

  const sessoes = lerColecao<Sessao>(CHAVES.sessoes);
  const dias = proximosDiasUteis(7);

  return profissionais.map((prof) => {
    const agendadas = sessoes.filter(
      (s) => s.profissionalId === prof.id && s.status === "agendada",
    );
    const disponibilidade = dias
      .map((data) => {
        const ocupados = agendadas.filter((s) => s.data === data).map((s) => s.horario);
        return { data, horarios: HORARIOS_DIA.filter((h) => !ocupados.includes(h)) };
      })
      .filter((d) => d.horarios.length > 0);
    return {
      profissionalId: prof.id,
      nomeProfissional: prof.nome,
      especialidade: prof.especialidade,
      disponibilidade,
    };
  });
}

// RF04 — Agendar Sessão Avulsa
export function agendarSessaoAvulsa(dados: {
  profissionalId: string;
  procedimentoNome: string;
  data: string;
  horario: string;
  clienteId: string;
}) {
  return _agendarSessao({ ...dados, pacoteId: null });
}

// RF06 — Agendar Sessão de Pacote · Regra: precisa de saldo
export function agendarSessaoDePacote({
  pacoteId,
  profissionalId,
  data,
  horario,
}: {
  pacoteId: string;
  profissionalId: string;
  data: string;
  horario: string;
}) {
  const pacotes = lerColecao<Pacote>(CHAVES.pacotes);
  const pacote = pacotes.find((p) => p.id === pacoteId);
  if (!pacote) throw new Error("Pacote não encontrado.");
  if (pacote.saldoSessoes <= 0)
    throw new Error(
      "Este pacote não tem sessões disponíveis. Considere comprar um novo pacote.",
    );

  const criada = _agendarSessao({
    profissionalId,
    procedimentoNome: pacote.procedimentoNome,
    data,
    horario,
    clienteId: pacote.clienteId,
    pacoteId,
  });

  pacote.saldoSessoes -= 1;
  salvarColecao(
    CHAVES.pacotes,
    pacotes.map((p) => (p.id === pacoteId ? pacote : p)),
  );
  return criada;
}

function _agendarSessao({
  profissionalId,
  procedimentoNome,
  data,
  horario,
  clienteId,
  pacoteId,
}: {
  profissionalId: string;
  procedimentoNome: string;
  data: string;
  horario: string;
  clienteId: string;
  pacoteId: string | null;
}): Sessao {
  const clientes = lerColecao<Cliente>(CHAVES.clientes);
  if (!clientes.some((c) => c.id === clienteId)) throw new Error("Cliente não encontrado.");

  const sessoes = lerColecao<Sessao>(CHAVES.sessoes);
  const conflito = sessoes.some(
    (s) =>
      s.profissionalId === profissionalId &&
      s.data === data &&
      s.horario === horario &&
      s.status === "agendada",
  );
  if (conflito)
    throw new Error("Esse horário já foi preenchido para este profissional. Escolha outro.");

  const nova: Sessao = {
    id: gerarId(),
    clienteId,
    profissionalId,
    pacoteId,
    data,
    horario,
    procedimentoNome,
    status: "agendada",
  };
  sessoes.push(nova);
  salvarColecao(CHAVES.sessoes, sessoes);
  return nova;
}

export interface SessaoDetalhada extends Sessao {
  nomeProfissional: string;
  nomeCliente?: string;
}

export function minhasSessoes(clienteId: string): SessaoDetalhada[] {
  const sessoes = lerColecao<Sessao>(CHAVES.sessoes).filter((s) => s.clienteId === clienteId);
  const mapa = Object.fromEntries(listarProfissionais().map((p) => [p.id, p.nome]));
  return sessoes
    .map((s) => ({ ...s, nomeProfissional: mapa[s.profissionalId] || "—" }))
    .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));
}

// RF07 — Cancelar Sessão · Regra: 2h de antecedência + devolve saldo do pacote
export function cancelarSessao(sessaoId: string, usuario: Sessao_Usuario) {
  const sessoes = lerColecao<Sessao>(CHAVES.sessoes);
  const alvo = sessoes.find((s) => s.id === sessaoId);
  if (!alvo) throw new Error("Sessão não encontrada.");
  if (usuario.role === "cliente" && alvo.clienteId !== usuario.id)
    throw new Error("Você só pode cancelar suas próprias sessões.");
  if (alvo.status !== "agendada") throw new Error("Esta sessão não está mais ativa.");
  if (horasAte(alvo.data, alvo.horario) < 2)
    throw new Error("Cancelamentos só são permitidos com no mínimo 2 horas de antecedência.");

  alvo.status = "cancelada";
  salvarColecao(
    CHAVES.sessoes,
    sessoes.map((s) => (s.id === sessaoId ? alvo : s)),
  );

  if (alvo.pacoteId) {
    const pacotes = lerColecao<Pacote>(CHAVES.pacotes);
    const pacote = pacotes.find((p) => p.id === alvo.pacoteId);
    if (pacote) {
      pacote.saldoSessoes += 1;
      salvarColecao(
        CHAVES.pacotes,
        pacotes.map((p) => (p.id === pacote.id ? pacote : p)),
      );
    }
  }
}

// RF08 — Remarcar Sessão
export function remarcarSessao(
  sessaoId: string,
  { novaData, novoHorario }: { novaData: string; novoHorario: string },
  usuario: Sessao_Usuario,
) {
  const sessoes = lerColecao<Sessao>(CHAVES.sessoes);
  const alvo = sessoes.find((s) => s.id === sessaoId);
  if (!alvo) throw new Error("Sessão não encontrada.");
  if (usuario.role === "cliente" && alvo.clienteId !== usuario.id)
    throw new Error("Você só pode remarcar suas próprias sessões.");
  if (alvo.status !== "agendada") throw new Error("Esta sessão não está mais ativa.");
  if (horasAte(alvo.data, alvo.horario) < 2)
    throw new Error(
      "Remarcações só são permitidas com no mínimo 2 horas de antecedência da sessão original.",
    );

  const conflito = sessoes.some(
    (s) =>
      s.id !== sessaoId &&
      s.profissionalId === alvo.profissionalId &&
      s.data === novaData &&
      s.horario === novoHorario &&
      s.status === "agendada",
  );
  if (conflito) throw new Error("O novo horário escolhido já está ocupado para este profissional.");

  alvo.data = novaData;
  alvo.horario = novoHorario;
  salvarColecao(
    CHAVES.sessoes,
    sessoes.map((s) => (s.id === sessaoId ? alvo : s)),
  );
}

// RF09 — Visualizar Agenda
export function visualizarAgenda(usuario: Sessao_Usuario): SessaoDetalhada[] {
  let lista = lerColecao<Sessao>(CHAVES.sessoes).filter((s) => s.status !== "cancelada");
  if (usuario.role === "profissional")
    lista = lista.filter((s) => s.profissionalId === usuario.id);

  const mapaClientes = Object.fromEntries(
    lerColecao<Cliente>(CHAVES.clientes).map((c) => [c.id, c.nome]),
  );
  const mapaProfissionais = Object.fromEntries(listarProfissionais().map((p) => [p.id, p.nome]));

  return lista
    .map((s) => ({
      ...s,
      nomeCliente: mapaClientes[s.clienteId] || "—",
      nomeProfissional: mapaProfissionais[s.profissionalId] || "—",
    }))
    .sort((a, b) => (a.data + a.horario).localeCompare(b.data + b.horario));
}

export function buscarClientePorCpf(cpf: string) {
  const cliente = lerColecao<Cliente>(CHAVES.clientes).find((c) => c.cpf === cpf);
  if (!cliente) throw new Error("Nenhum cliente encontrado com este CPF.");
  return { id: cliente.id, nome: cliente.nome };
}

// RF10 — Registrar Atendimento
export function registrarAtendimento(
  {
    sessaoId,
    observacoes,
    produtosUtilizados,
  }: { sessaoId: string; observacoes?: string; produtosUtilizados?: string },
  usuario: Sessao_Usuario,
) {
  const sessoes = lerColecao<Sessao>(CHAVES.sessoes);
  const alvo = sessoes.find((s) => s.id === sessaoId);
  if (!alvo) throw new Error("Sessão não encontrada.");
  if (alvo.profissionalId !== usuario.id)
    throw new Error("Você só pode registrar atendimentos de sessões atribuídas a você.");

  const atendimentos = lerColecao<Atendimento>(CHAVES.atendimentos);
  if (atendimentos.some((a) => a.sessaoId === sessaoId))
    throw new Error("Esta sessão já possui um atendimento registrado.");

  atendimentos.push({
    id: gerarId(),
    sessaoId,
    observacoes: observacoes || "",
    produtosUtilizados: produtosUtilizados || "",
  });
  salvarColecao(CHAVES.atendimentos, atendimentos);

  alvo.status = "realizada";
  salvarColecao(
    CHAVES.sessoes,
    sessoes.map((s) => (s.id === sessaoId ? alvo : s)),
  );
}

// RF05 + RF13 — Vender Pacote de Sessões
export function venderPacote({
  clienteId,
  procedimentoNome,
  quantidadeSessoes,
  valorTotal,
  pagamentoInicial,
}: {
  clienteId: string;
  procedimentoNome: string;
  quantidadeSessoes: number | string;
  valorTotal: number | string;
  pagamentoInicial?: { valor: number; formaPagamento: string; data: string };
}) {
  if (!clienteId || !procedimentoNome || !quantidadeSessoes || !valorTotal) {
    throw new Error("Preencha cliente, procedimento, quantidade de sessões e valor total.");
  }
  const pacotes = lerColecao<Pacote>(CHAVES.pacotes);
  const novoPacote: Pacote = {
    id: gerarId(),
    clienteId,
    procedimentoNome,
    quantidadeSessoes: Number(quantidadeSessoes),
    saldoSessoes: Number(quantidadeSessoes),
    valorTotal: Number(valorTotal),
    valorPago: 0,
  };
  pacotes.push(novoPacote);
  salvarColecao(CHAVES.pacotes, pacotes);

  if (pagamentoInicial && Number(pagamentoInicial.valor) > 0) {
    registrarPagamento({
      pacoteId: novoPacote.id,
      valor: Number(pagamentoInicial.valor),
      formaPagamento: pagamentoInicial.formaPagamento,
      data: pagamentoInicial.data,
    });
  }
  return novoPacote;
}

// RF13 — Registrar Pagamento de Pacote · Regra: não passar do valor total
export function registrarPagamento({
  pacoteId,
  valor,
  formaPagamento,
  data,
}: {
  pacoteId: string;
  valor: number;
  formaPagamento?: string;
  data?: string;
}) {
  const pacotes = lerColecao<Pacote>(CHAVES.pacotes);
  const pacote = pacotes.find((p) => p.id === pacoteId);
  if (!pacote) throw new Error("Pacote não encontrado.");
  if (!valor || valor <= 0) throw new Error("Informe um valor de pagamento válido.");

  const saldoDevedor = pacote.valorTotal - pacote.valorPago;
  if (valor > saldoDevedor)
    throw new Error(
      `O valor informado ultrapassa o saldo devedor (${formatarMoeda(saldoDevedor)}).`,
    );

  const pagamentos = lerColecao<Pagamento>(CHAVES.pagamentos);
  pagamentos.push({
    id: gerarId(),
    pacoteId,
    valor,
    formaPagamento: formaPagamento || "não informado",
    data: data || new Date().toISOString().slice(0, 10),
  });
  salvarColecao(CHAVES.pagamentos, pagamentos);

  pacote.valorPago += valor;
  salvarColecao(
    CHAVES.pacotes,
    pacotes.map((p) => (p.id === pacoteId ? pacote : p)),
  );
}

// RF11 + RF14 — Consultar Situação do Pacote
export interface PacoteDetalhado extends Pacote {
  saldoDevedor: number;
}
export function meusPacotes(clienteId: string): PacoteDetalhado[] {
  return lerColecao<Pacote>(CHAVES.pacotes)
    .filter((p) => p.clienteId === clienteId)
    .map((p) => ({ ...p, saldoDevedor: p.valorTotal - p.valorPago }));
}
export function pacotesComSaldo(clienteId: string) {
  return meusPacotes(clienteId).filter((p) => p.saldoSessoes > 0);
}

// RF12 — Gerar Relatório Gerencial
export function relatorioMensal(mes: string) {
  const sessoes = lerColecao<Sessao>(CHAVES.sessoes).filter(
    (s) => s.status === "realizada" && s.data.startsWith(mes),
  );
  if (sessoes.length === 0)
    return {
      mes,
      totalAtendimentos: 0,
      porProcedimento: {} as Record<string, number>,
      mensagem: "Não há atendimentos registrados neste período.",
    };

  const porProcedimento: Record<string, number> = {};
  sessoes.forEach((s) => {
    porProcedimento[s.procedimentoNome] = (porProcedimento[s.procedimentoNome] || 0) + 1;
  });
  return { mes, totalAtendimentos: sessoes.length, porProcedimento, mensagem: "" };
}

// ---------------------------------------------------------
// Sessão de login
// ---------------------------------------------------------
const CHAVE_SESSAO = "sae_sessao";

export function getSessao(): Sessao_Usuario | null {
  if (!temStorage()) return null;
  const raw = localStorage.getItem(CHAVE_SESSAO);
  return raw ? (JSON.parse(raw) as Sessao_Usuario) : null;
}
export function salvarSessao(dados: Sessao_Usuario) {
  if (!temStorage()) return;
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados));
}
export function limparSessao() {
  if (!temStorage()) return;
  localStorage.removeItem(CHAVE_SESSAO);
}

export function formatarData(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
export function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function resetarDados() {
  if (!temStorage()) return;
  Object.values(CHAVES).forEach((c) => localStorage.removeItem(c));
  localStorage.removeItem(CHAVE_SESSAO);
  popularDadosDeExemplo();
}
