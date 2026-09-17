import { formatarData, type DisponibilidadeProfissional } from "@/lib/db";
import { Vazio } from "./camelia";

export function ListaDisponibilidade({
  resultado,
  onSelect,
  dias = 3,
}: {
  resultado: DisponibilidadeProfissional[] | null;
  onSelect: (profissionalId: string, data: string, horario: string) => void;
  dias?: number;
}) {
  if (!resultado) return null;
  if (resultado.length === 0)
    return <Vazio>Nenhum horário disponível nos próximos dias.</Vazio>;

  return (
    <div className="space-y-5">
      {resultado.map((prof) => (
        <div key={prof.profissionalId}>
          <p className="font-serif text-lg text-ink">{prof.nomeProfissional}</p>
          <p className="mb-2 text-xs text-ink/50">{prof.especialidade}</p>
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
                      <button
                        key={h}
                        type="button"
                        onClick={() => onSelect(prof.profissionalId, d.data, h)}
                        className="rounded-full border border-rose-petal bg-blush px-3 py-1.5 text-xs text-ink transition-colors hover:border-orchid hover:bg-orchid hover:text-primary-foreground"
                      >
                        {h}
                      </button>
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
