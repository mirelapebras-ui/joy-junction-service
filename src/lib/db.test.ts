import { describe, it, beforeEach } from "node:test";
import { strict as assert } from "node:assert";

// O "banco" do protótipo vive no localStorage do navegador.
// Aqui ele é substituído por um depósito em memória, para testar as regras
// sem depender de navegador.
const deposito = new Map<string, string>();
const localStorageSimulado = {
  getItem: (chave: string) => (deposito.has(chave) ? deposito.get(chave)! : null),
  setItem: (chave: string, valor: string) => {
    deposito.set(chave, String(valor));
  },
  removeItem: (chave: string) => {
    deposito.delete(chave);
  },
  clear: () => deposito.clear(),
  key: (indice: number) => [...deposito.keys()][indice] ?? null,
  get length() {
    return deposito.size;
  },
};
(globalThis as Record<string, unknown>).localStorage = localStorageSimulado;
(globalThis as Record<string, unknown>).window = globalThis;

import {
  agendarSessaoAvulsa,
  agendarSessaoDePacote,
  cadastrarCliente,
  cancelarSessao,
  podeAlterarSessao,
  registrarAtendimento,
  registrarPagamento,
  venderPacote,
  type Sessao_Usuario,
} from "./db";

const CHAVES = {
  profissionais: "sae_db_profissionais",
  sessoes: "sae_db_sessoes",
  pacotes: "sae_db_pacotes",
};

function gravar(chave: string, lista: unknown[]) {
  localStorageSimulado.setItem(chave, JSON.stringify(lista));
}

function ler<T>(chave: string): T[] {
  const bruto = localStorageSimulado.getItem(chave);
  return bruto ? (JSON.parse(bruto) as T[]) : [];
}

interface SessaoTeste {
  id: string;
  status: string;
  pacoteId: string | null;
}

interface PacoteTeste {
  id: string;
  saldoSessoes: number;
}

const PROFISSIONAL_ID = "p-bianca";
const profissional = {
  id: PROFISSIONAL_ID,
  nome: "Bianca Rocha",
  especialidade: "Limpeza de Pele",
  senha: "123456",
};

const clienteUsuario: Sessao_Usuario = { id: "", nome: "Ana Paula Ribeiro", role: "cliente" };
const recepcaoUsuario: Sessao_Usuario = { id: "s-1", nome: "Fernanda Lima", role: "secretaria" };

// Data e hora locais, com N horas de diferença em relação a agora.
// Negativo = já passou.
function dataHoraDentroDeHoras(horas: number) {
  const d = new Date(Date.now() + horas * 60 * 60 * 1000);
  const data = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  const horario = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return { data, horario };
}

function novoCliente() {
  const usuario = cadastrarCliente({
    nome: "Ana Paula Ribeiro",
    cpf: "111.111.111-11",
    dataNascimento: "1994-03-10",
    telefone: "(15) 99111-2233",
    senha: "123456",
  });
  clienteUsuario.id = usuario.id;
  return usuario;
}

beforeEach(() => {
  deposito.clear();
  gravar(CHAVES.profissionais, [profissional]);
  novoCliente();
});

describe("regra: CPF não pode se repetir", () => {
  it("recusa o segundo cadastro com o mesmo CPF", () => {
    assert.throws(
      () =>
        cadastrarCliente({
          nome: "Outra Pessoa",
          cpf: "111.111.111-11",
          dataNascimento: "1990-01-01",
          telefone: "(15) 90000-0000",
          senha: "123456",
        }),
      /Já existe um cliente cadastrado com este CPF\./,
    );
  });

  it("aceita um CPF diferente", () => {
    const segunda = cadastrarCliente({
      nome: "Júlia Martins",
      cpf: "222.222.222-22",
      dataNascimento: "1998-07-22",
      telefone: "(15) 99222-3344",
      senha: "123456",
    });
    assert.equal(segunda.role, "cliente");
    assert.equal(segunda.nome, "Júlia Martins");
  });
});

describe("regra: um profissional não pode ter duas sessões no mesmo horário", () => {
  it("recusa a segunda sessão no mesmo dia e horário", () => {
    const { data, horario } = dataHoraDentroDeHoras(3);
    agendarSessaoAvulsa({
      profissionalId: PROFISSIONAL_ID,
      procedimentoNome: "Limpeza de Pele",
      data,
      horario,
      clienteId: clienteUsuario.id,
    });

    assert.throws(
      () =>
        agendarSessaoAvulsa({
          profissionalId: PROFISSIONAL_ID,
          procedimentoNome: "Limpeza de Pele",
          data,
          horario,
          clienteId: clienteUsuario.id,
        }),
      /já foi preenchido para este profissional/,
    );
  });

  it("libera outro horário do mesmo dia", () => {
    const { data } = dataHoraDentroDeHoras(3);
    agendarSessaoAvulsa({
      profissionalId: PROFISSIONAL_ID,
      procedimentoNome: "Limpeza de Pele",
      data,
      horario: "09:00",
      clienteId: clienteUsuario.id,
    });
    const segunda = agendarSessaoAvulsa({
      profissionalId: PROFISSIONAL_ID,
      procedimentoNome: "Limpeza de Pele",
      data,
      horario: "10:00",
      clienteId: clienteUsuario.id,
    });
    assert.equal(segunda.horario, "10:00");
    assert.equal(ler<SessaoTeste>(CHAVES.sessoes).length, 2);
  });
});

describe("regra: mínimo de 2 horas de antecedência para a cliente", () => {
  it("considera alterável só uma sessão a partir de 2 horas", () => {
    const longe = dataHoraDentroDeHoras(3);
    const perto = dataHoraDentroDeHoras(1);
    assert.equal(podeAlterarSessao({ ...longe, status: "agendada" }), true);
    assert.equal(podeAlterarSessao({ ...perto, status: "agendada" }), false);
  });

  it("impede a cliente de cancelar com menos de 2 horas", () => {
    const { data, horario } = dataHoraDentroDeHoras(1);
    const sessao = agendarSessaoAvulsa({
      profissionalId: PROFISSIONAL_ID,
      procedimentoNome: "Limpeza de Pele",
      data,
      horario,
      clienteId: clienteUsuario.id,
    });

    assert.throws(
      () => cancelarSessao(sessao.id, clienteUsuario),
      /no mínimo 2 horas de antecedência/,
    );
    assert.equal(ler<SessaoTeste>(CHAVES.sessoes)[0]!.status, "agendada");
  });
});

describe("regra: a recepção pode cancelar a qualquer momento", () => {
  it("cancela uma sessão cujo horário já passou", () => {
    const { data, horario } = dataHoraDentroDeHoras(-3);
    const sessao = agendarSessaoAvulsa({
      profissionalId: PROFISSIONAL_ID,
      procedimentoNome: "Limpeza de Pele",
      data,
      horario,
      clienteId: clienteUsuario.id,
    });

    cancelarSessao(sessao.id, recepcaoUsuario);

    assert.equal(ler<SessaoTeste>(CHAVES.sessoes)[0]!.status, "cancelada");
  });
});

describe("regra: sessão de pacote precisa de saldo", () => {
  it("recusa quando o pacote está sem sessões", () => {
    const pacote = venderPacote({
      clienteId: clienteUsuario.id,
      procedimentoNome: "Limpeza de Pele",
      quantidadeSessoes: 1,
      valorTotal: 150,
    });
    const { data, horario } = dataHoraDentroDeHoras(3);
    agendarSessaoDePacote({
      pacoteId: pacote.id,
      profissionalId: PROFISSIONAL_ID,
      data,
      horario,
    });

    assert.equal(ler<PacoteTeste>(CHAVES.pacotes)[0]!.saldoSessoes, 0);
    assert.throws(
      () =>
        agendarSessaoDePacote({
          pacoteId: pacote.id,
          profissionalId: PROFISSIONAL_ID,
          data: dataHoraDentroDeHoras(5).data,
          horario: "14:00",
        }),
      /não tem sessões disponíveis/,
    );
  });
});

describe("regra: cancelar sessão de pacote devolve o saldo", () => {
  it("devolve a sessão ao pacote", () => {
    const pacote = venderPacote({
      clienteId: clienteUsuario.id,
      procedimentoNome: "Limpeza de Pele",
      quantidadeSessoes: 2,
      valorTotal: 300,
    });
    const { data, horario } = dataHoraDentroDeHoras(4);
    const sessao = agendarSessaoDePacote({
      pacoteId: pacote.id,
      profissionalId: PROFISSIONAL_ID,
      data,
      horario,
    });
    assert.equal(ler<PacoteTeste>(CHAVES.pacotes)[0]!.saldoSessoes, 1);

    cancelarSessao(sessao.id, clienteUsuario);

    assert.equal(ler<PacoteTeste>(CHAVES.pacotes)[0]!.saldoSessoes, 2);
    assert.equal(ler<SessaoTeste>(CHAVES.sessoes)[0]!.status, "cancelada");
  });
});

describe("regra: pagamento não pode ultrapassar o valor total", () => {
  it("recusa um valor maior que o saldo devedor", () => {
    const pacote = venderPacote({
      clienteId: clienteUsuario.id,
      procedimentoNome: "Limpeza de Pele",
      quantidadeSessoes: 5,
      valorTotal: 750,
    });

    assert.throws(
      () => registrarPagamento({ pacoteId: pacote.id, valor: 900, formaPagamento: "pix" }),
      /ultrapassa o saldo devedor/,
    );
    assert.equal(ler<PacoteTeste>(CHAVES.pacotes)[0]!.saldoSessoes, 5);
  });

  it("aceita um pagamento parcial e reduz o saldo devedor", () => {
    const pacote = venderPacote({
      clienteId: clienteUsuario.id,
      procedimentoNome: "Limpeza de Pele",
      quantidadeSessoes: 5,
      valorTotal: 750,
    });

    registrarPagamento({ pacoteId: pacote.id, valor: 300, formaPagamento: "pix" });

    const pago = ler<{ valorPago: number }>(CHAVES.pacotes)[0]!;
    assert.equal(pago.valorPago, 300);
  });
});

describe("regra: só o profissional responsável registra o atendimento", () => {
  it("impede outro profissional de registrar", () => {
    const { data, horario } = dataHoraDentroDeHoras(3);
    const sessao = agendarSessaoAvulsa({
      profissionalId: PROFISSIONAL_ID,
      procedimentoNome: "Limpeza de Pele",
      data,
      horario,
      clienteId: clienteUsuario.id,
    });
    const outroProfissional: Sessao_Usuario = {
      id: "p-outro",
      nome: "Rafael Souza",
      role: "profissional",
    };

    assert.throws(
      () => registrarAtendimento({ sessaoId: sessao.id }, outroProfissional),
      /atribuídas a você/,
    );
    assert.equal(ler<SessaoTeste>(CHAVES.sessoes)[0]!.status, "agendada");
  });

  it("deixa o profissional responsável registrar", () => {
    const { data, horario } = dataHoraDentroDeHoras(3);
    const sessao = agendarSessaoAvulsa({
      profissionalId: PROFISSIONAL_ID,
      procedimentoNome: "Limpeza de Pele",
      data,
      horario,
      clienteId: clienteUsuario.id,
    });
    const profissionalUsuario: Sessao_Usuario = {
      id: PROFISSIONAL_ID,
      nome: "Bianca Rocha",
      role: "profissional",
    };

    registrarAtendimento({ sessaoId: sessao.id, observacoes: "Pele hidratada." }, profissionalUsuario);

    assert.equal(ler<SessaoTeste>(CHAVES.sessoes)[0]!.status, "realizada");
  });
});
