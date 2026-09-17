import { createFileRoute } from "@tanstack/react-router";
import heroSpa from "@/assets/hero-spa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vênus · Agendamento online" },
      {
        name: "description",
        content:
          "Reserve seu horário em segundos. Escolha o serviço, o profissional e o melhor horário — sem ligações, sem espera, sem complicação.",
      },
      { property: "og:title", content: "Vênus · Agendamento online" },
      {
        property: "og:description",
        content:
          "Reserve seu horário em segundos. Escolha o serviço, o profissional e o melhor horário.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const services = [
  {
    icon: "✦",
    iconBg: "bg-petal/30",
    title: "Corte & styling",
    description: "Acabamento impecável com um profissional sênior.",
    details: "45 min · R$ 120",
  },
  {
    icon: "✧",
    iconBg: "bg-lilac/30",
    title: "Coloração",
    description: "Loiro, morena iluminada ou tonalização.",
    details: "90 min · R$ 250",
  },
  {
    icon: "❋",
    iconBg: "bg-rose-petal/50",
    title: "Manicure & spa",
    description: "Mãos, pés e hidratação relaxante.",
    details: "60 min · R$ 90",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-blush text-ink" style={{ fontFamily: "var(--font-body-sans)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 bg-blush border-b border-rose-petal/60">
        <div className="text-2xl text-ink" style={{ fontFamily: "var(--font-serif-display)" }}>
          Vênus
        </div>
        <ul className="hidden md:flex items-center gap-8 text-sm text-ink/70">
          <li>
            <a href="#servicos" className="hover:text-orchid transition-colors">
              Serviços
            </a>
          </li>
          <li>
            <a href="#profissionais" className="hover:text-orchid transition-colors">
              Profissionais
            </a>
          </li>
          <li>
            <a href="#sobre" className="hover:text-orchid transition-colors">
              Sobre
            </a>
          </li>
        </ul>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm text-ink/70 hover:text-ink transition-colors">
            Entrar
          </button>
          <button className="px-5 py-2.5 text-sm font-medium text-white bg-orchid rounded-full hover:bg-mauve transition-colors">
            Agendar
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-blush px-8 pt-16 pb-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-lilac/40" />
          <div className="absolute top-40 left-1/2 w-72 h-72 rounded-full bg-rose-petal/50" />
        </div>
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 text-xs uppercase tracking-[0.15em] text-orchid bg-lilac/20 rounded-full">
              Agendamento online
            </span>
            <h1
              className="text-6xl leading-[1.05] text-ink mt-5"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              Reserve seu horário em{" "}
              <span className="text-orchid italic">segundos</span>.
            </h1>
            <p className="text-lg text-ink/60 mt-5 max-w-md">
              Escolha o serviço, o profissional e o melhor horário. Sem ligações, sem
              espera, sem complicação.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <button className="px-7 py-3.5 text-sm font-medium text-white bg-orchid rounded-full hover:bg-mauve transition-colors">
                Ver horários livres
              </button>
              <button className="px-7 py-3.5 text-sm font-medium text-ink bg-rose-petal rounded-full hover:bg-petal/60 transition-colors">
                Como funciona
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroSpa}
              alt="Interior de spa com tons de rosa e lilás, decoração minimalista e calma"
              width={1200}
              height={1000}
              className="w-full aspect-[6/5] object-cover rounded-3xl outline-1 -outline-offset-1 outline-black/5"
            />
            <div className="absolute -bottom-6 -left-6 w-64 p-5 bg-white rounded-2xl shadow-xl shadow-lilac/30">
              <div className="text-xs text-ink/50" style={{ fontFamily: "var(--font-body-sans)" }}>
                Próximo horário
              </div>
              <div
                className="text-2xl text-ink mt-1"
                style={{ fontFamily: "var(--font-serif-display)" }}
              >
                Hoje · 14h30
              </div>
              <div
                className="text-xs text-orchid mt-1"
                style={{ fontFamily: "var(--font-body-sans)" }}
              >
                Corte & styling · Marina
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="bg-white px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2
                className="text-4xl text-ink"
                style={{ fontFamily: "var(--font-serif-display)" }}
              >
                Nossos serviços
              </h2>
              <p className="text-ink/50 mt-2 text-sm">
                Toque em um card para ver os horários disponíveis.
              </p>
            </div>
            <a
              href="#"
              className="text-sm text-orchid hover:underline"
              style={{ fontFamily: "var(--font-body-sans)" }}
            >
              Ver todos
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="p-6 bg-blush rounded-2xl border border-rose-petal/60 hover:shadow-lg hover:shadow-rose-petal/40 transition-shadow"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${service.iconBg} grid place-items-center text-xl`}
                >
                  {service.icon}
                </div>
                <h3
                  className="text-xl text-ink mt-4"
                  style={{ fontFamily: "var(--font-serif-display)" }}
                >
                  {service.title}
                </h3>
                <p className="text-sm text-ink/55 mt-2">{service.description}</p>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-sm text-orchid font-medium">{service.details}</span>
                  <span className="text-xs text-white bg-orchid px-3 py-1 rounded-full">
                    Agendar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Email */}
      <section className="bg-lilac/15 px-8 py-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-3xl text-ink"
              style={{ fontFamily: "var(--font-serif-display)" }}
            >
              Sem tempo para escolher?
            </h3>
            <p className="text-ink/55 mt-2">Receba um lembrete e agende com um toque.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 md:w-72 px-5 py-3.5 text-sm bg-white rounded-full border border-rose-petal outline-none focus:border-orchid transition-colors"
            />
            <button className="px-6 py-3.5 text-sm font-medium text-white bg-orchid rounded-full hover:bg-mauve transition-colors whitespace-nowrap">
              Quero agendar
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <span
            className="text-xl text-blush"
            style={{ fontFamily: "var(--font-serif-display)" }}
          >
            Vênus
          </span>
          <span className="text-xs text-blush/50">
            © 2024 · Feito com carinho
          </span>
        </div>
      </footer>
    </div>
  );
}
