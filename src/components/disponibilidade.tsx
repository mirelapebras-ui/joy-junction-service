import { formatarData, type DisponibilidadeProfissional } from "@/lib/db";
import { Vazio } from "./camelia";
import { Button } from "@/components/ui/button";

export function ListaDisponibilidade({
  resultado,
  onSelect,
  selecionado,
  dias = 3,
}: {
  resultado: DisponibilidadeProfissional[] | null;
  onSelect: (profissionalId: string, data: string, horario: string) => void;
  selecionado?: { profissionalId: string; data: string; horario: string } | null;
  dias?: number;
}) {
  if (!resultado) return null;
  if (resultado.length === 0)
    return <Vazio>Nenhum horário disponível nos próximos dias.</Vazio>;

  return (
    <div className="space-y-5">
      {resultado.map((prof) => (
        <div key={prof.profissionalId}>
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-lilac/20 text-xs font-semibold text-orchid">
              {prof.nomeProfissional.split(" ").map((nome) => nome[0]).slice(0, 2).join("")}
            </span>
            <span>
              <span className="block font-medium text-ink">{prof.nomeProfissional}</span>
              <span className="block text-xs text-ink/45">{prof.especialidade}</span>
            </span>
          </div>
          {prof.disponibilidade.length === 0 ? (
            <Vazio>Sem horários livres nos próximos dias.</Vazio>
          ) : (
            <div className="space-y-3">
              {prof.disponibilidade.slice(0, dias).map((d) => (
                <div key={d.data}>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-ink/55">
                    {formatarData(d.data)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {d.horarios.map((h) => (
                      <Button
                        key={h}
                        type="button"
                        onClick={() => onSelect(prof.profissionalId, d.data, h)}
                        aria-pressed={selecionado?.profissionalId === prof.profissionalId && selecionado.data === d.data && selecionado.horario === h}
                        variant="outline"
                        size="sm"
                        className={`min-w-16 rounded-lg px-3 text-xs ${
                          selecionado?.profissionalId === prof.profissionalId && selecionado.data === d.data && selecionado.horario === h
                            ? "border-orchid bg-orchid text-primary-foreground shadow-sm"
                            : "border-rose-petal bg-blush text-ink hover:border-orchid hover:bg-lilac/20"
                        }`}
                      >
                        {h}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
