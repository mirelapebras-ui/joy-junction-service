import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  cadastrarCliente,
  getSessao,
  login,
  popularDadosDeExemplo,
  salvarSessao,
  type Role,
} from "@/lib/db";
import { CameliaMark, Campo, Mensagem, inputClass } from "@/components/camelia";

export const Route = createFileRoute("/acesso")({
  head: () => ({
    meta: [
      { title: "Entrar · Camélia Estética" },
      {
        name: "description",
        content:
          "Acesse sua conta da Camélia Estética para agendar, remarcar ou cancelar sessões, ou crie sua conta de cliente em um minuto.",
      },
      { property: "og:title", content: "Entrar · Camélia Estética" },
      {
        property: "og:description",
        content: "Acesse sua conta para agendar, remarcar ou cancelar sessões.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Acesso,
});

const labels: Record<Role, string> = {
  cliente: "CPF",
  secretaria: "Login",
  profissional: "Nome",
};
const placeholders: Record<Role, string> = {
  cliente: "000.000.000-00",
  secretaria: "secretaria",
  profissional: "Nome completo",
};
const rotas: Record<Role, string> = {
  cliente: "/cliente",
  secretaria: "/secretaria",
  profissional: "/profissional",
};

function Acesso() {
  const navigate = useNavigate();
  const [aba, setAba] = useState<"entrar" | "cadastro">("entrar");
  const [role, setRole] = useState<Role>("cliente");
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const [erroCadastro, setErroCadastro] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    senha: "",
  });

  useEffect(() => {
    popularDadosDeExemplo();
    const s = getSessao();
    if (s) navigate({ to: rotas[s.role] });
  }, [navigate]);

  function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErroLogin(null);
    try {
      const dados = login({ cpfOuLogin: identificador.trim(), senha, role });
      salvarSessao(dados);
      navigate({ to: rotas[dados.role] });
    } catch (err) {
      setErroLogin((err as Error).message);
    }
  }

  function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErroCadastro(null);
    try {
      const dados = cadastrarCliente({
        nome: form.nome.trim(),
        cpf: form.cpf.trim(),
        dataNascimento: form.dataNascimento,
        telefone: form.telefone.trim(),
        senha: form.senha,
      });
      salvarSessao(dados);
      navigate({ to: "/cliente" });
    } catch (err) {
      setErroCadastro((err as Error).message);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-blush px-4 py-12 font-body text-ink">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <CameliaMark className="h-12 w-12" />
            <span className="font-serif text-3xl text-ink">Camélia Estética</span>
          </Link>
          <p className="mt-2 text-sm text-ink/55">
            Agende sessões avulsas ou de pacote em um só lugar.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-rose-petal/70 bg-card p-6 shadow-lg shadow-rose-petal/40">
          <div className="mb-6 flex rounded-full bg-blush p-1">
            {(["entrar", "cadastro"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAba(a)}
                className={`flex-1 rounded-full py-2 text-sm transition-colors ${
                  aba === a
                    ? "bg-orchid text-primary-foreground"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {a === "entrar" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          {aba === "entrar" ? (
            <form onSubmit={entrar}>
              <Campo label="Eu sou">
                <div className="flex gap-2">
                  {(["cliente", "secretaria", "profissional"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRole(r);
                        setIdentificador("");
                      }}
                      className={`flex-1 rounded-full border px-2 py-2 text-xs transition-colors ${
                        role === r
                          ? "border-orchid bg-lilac/25 text-orchid"
                          : "border-rose-petal text-ink/60 hover:border-mauve"
                      }`}
                    >
                      {r === "cliente"
                        ? "Cliente"
                        : r === "secretaria"
                          ? "Secretária"
                          : "Profissional"}
                    </button>
                  ))}
                </div>
              </Campo>

              <Campo label={labels[role]}>
                <input
                  className={inputClass}
                  placeholder={placeholders[role]}
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                />
              </Campo>
              <Campo label="Senha">
                <input
                  className={inputClass}
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </Campo>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-orchid py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-mauve"
              >
                Entrar
              </button>
              <Mensagem texto={erroLogin} />

              <div className="mt-6 rounded-2xl bg-blush px-4 py-3 text-xs leading-relaxed text-ink/55">
                <strong className="text-ink/75">Acessos de teste</strong>
                <br />
                Cliente — CPF 111.111.111-11 · senha 123456
                <br />
                Secretária — login “secretaria” · senha 123456
                <br />
                Profissional — nome “Bianca Rocha” · senha 123456
              </div>
            </form>
          ) : (
            <form onSubmit={cadastrar}>
              <Campo label="Nome completo">
                <input
                  className={inputClass}
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </Campo>
              <Campo label="CPF">
                <input
                  className={inputClass}
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                />
              </Campo>
              <Campo label="Data de nascimento">
                <input
                  className={inputClass}
                  type="date"
                  value={form.dataNascimento}
                  onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
                />
              </Campo>
              <Campo label="Telefone">
                <input
                  className={inputClass}
                  placeholder="(00) 00000-0000"
                  value={form.telefone}
                  onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                />
              </Campo>
              <Campo label="Senha">
                <input
                  className={inputClass}
                  type="password"
                  placeholder="Crie uma senha"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                />
              </Campo>
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-orchid py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-mauve"
              >
                Criar conta e entrar
              </button>
              <Mensagem texto={erroCadastro} />
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink/45">
          <Link to="/" className="hover:text-orchid">
            Voltar para a página inicial
          </Link>
        </p>
      </div>
    </div>
  );
}
