import { Quote, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const relatos = [
  { nome: "Ana", procedimento: "Limpeza de pele", texto: "Um momento só meu. Saí com aquela sensação gostosa de ter feito uma pausa para me cuidar.", iniciais: "A" },
  { nome: "Júlia", procedimento: "Massagem modeladora", texto: "Gostei de poder escolher um horário que combina com minha rotina e chegar com tudo organizado.", iniciais: "J" },
  { nome: "Marina", procedimento: "Depilação a laser", texto: "Ter minhas sessões reunidas em um só lugar deixa meu cuidado mais leve e tranquilo.", iniciais: "M" },
];

const duvidas = [
  { pergunta: "Como faço para agendar uma sessão?", resposta: "Entre na sua conta ou faça seu cadastro. Escolha o procedimento, o profissional e uma data; depois selecione um horário disponível e confirme sua sessão." },
  { pergunta: "Posso cancelar ou remarcar meu horário?", resposta: "Sim. Na sua área, abra Minhas sessões e escolha Cancelar ou Remarcar. Para clientes, é necessário ter pelo menos 2 horas de antecedência. Se o prazo já passou, fale com a recepção." },
  { pergunta: "Qual é a diferença entre sessão avulsa e pacote?", resposta: "A sessão avulsa é um agendamento individual. O pacote reúne sessões de um procedimento e pode ser adquirido com a recepção. Você acompanha as sessões restantes e os pagamentos na sua área." },
  { pergunta: "O que acontece se eu cancelar uma sessão do pacote?", resposta: "Ao cancelar uma sessão agendada de um pacote, o saldo dessa sessão é devolvido ao pacote para um novo agendamento." },
  { pergunta: "Preciso me cadastrar para ver os procedimentos?", resposta: "Não. Você pode consultar os procedimentos sem entrar. O cadastro é necessário para confirmar agendamentos e acompanhar suas sessões." },
];

export function HomeTestimonials() {
  return (
    <section aria-labelledby="relatos-title" className="bg-rose-petal/35 px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase text-orchid">Momentos de cuidado</p>
        <h2 id="relatos-title" className="mt-3 font-serif text-3xl md:text-4xl">Pequenas pausas, boas histórias</h2>
        <p className="mt-3 text-sm text-muted-foreground">Depoimentos ilustrativos para este projeto acadêmico; não são avaliações reais.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {relatos.map((relato) => (
            <figure key={relato.nome} className="flex flex-col rounded-lg border border-border bg-card p-6 md:p-7">
              <Quote aria-hidden="true" className="h-7 w-7 text-mauve" />
              <blockquote className="mt-5 flex-1 font-serif text-xl leading-relaxed">“{relato.texto}”</blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-border pt-5">
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage-soft font-serif text-lg text-sage-deep">{relato.iniciais}</span>
                <span><span className="block text-sm font-medium">{relato.nome} · exemplo</span><span className="mt-1 block text-xs text-muted-foreground">{relato.procedimento}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section aria-labelledby="duvidas-title" className="bg-card px-6 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <div>
          <p className="text-xs font-medium uppercase text-sage-deep">Antes da sua visita</p>
          <h2 id="duvidas-title" className="mt-3 font-serif text-3xl md:text-4xl">Tudo mais claro,<br />desde o começo.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">Respostas para as dúvidas mais comuns sobre agendamentos e pacotes.</p>
          <Button asChild variant="link" className="mt-5 h-auto px-0 text-orchid"><Link to="/acesso">Ir para minha conta <ArrowUpRight /></Link></Button>
        </div>
        <Accordion type="single" collapsible className="min-w-0">
          {duvidas.map((item, i) => (
            <AccordionItem key={item.pergunta} value={`duvida-${i}`} className="border-rose-petal">
              <AccordionTrigger className="gap-5 py-5 text-base text-ink hover:no-underline">{item.pergunta}</AccordionTrigger>
              <AccordionContent className="pr-6 leading-relaxed text-muted-foreground">{item.resposta}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}