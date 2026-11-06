import fondo from '../assets/background/fondo1.png'
import type { Personaje } from '../data/knowledgeBase.ts'

type Props = {
  titulo: string
  personajeJugador: Personaje
  personajeCPU: Personaje
  onMenu: () => void
}

export default function FinPartida({ titulo, personajeJugador, personajeCPU, onMenu }: Props) {
  return (
    <main className="relative min-h-[100dvh]">
      <img src={fondo} alt="" className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-ink/84" />
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] items-center gap-10 px-4 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div className="rise">
          <p className="font-saiyan text-sm tracking-wide text-ember">FIN DE PARTIDA</p>
          <h1 className="mt-3 max-w-[14ch] text-4xl leading-none tracking-tighter text-paper md:text-6xl">
            {titulo}
          </h1>
          <button
            type="button"
            onClick={onMenu}
            className="btn mt-8"
          >
            Volver al menú
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
          <figure>
            <img src={personajeCPU.imagen} alt="" className="h-64 w-full object-contain object-left" />
            <figcaption className="mt-3 text-sm text-stone-300">
              Carta de la CPU
              <span className="mt-1 block text-lg text-paper">{personajeCPU.nombre}</span>
            </figcaption>
          </figure>
          <figure className="sm:mb-8">
            <img src={personajeJugador.imagen} alt="" className="h-40 w-full object-contain object-left" />
            <figcaption className="mt-3 text-sm text-stone-300">
              Tu carta
              <span className="mt-1 block text-lg text-paper">{personajeJugador.nombre}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </main>
  )
}
