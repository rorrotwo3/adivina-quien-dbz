import fondo from '../assets/background/fondo1.png'
import { PERSONAJES, type Personaje } from '../data/knowledgeBase.ts'
import Carta from './Carta.tsx'

type Props = {
  onElegir: (personaje: Personaje) => void
  onVolver: () => void
}

export default function SeleccionPersonaje({ onElegir, onVolver }: Props) {
  return (
    <main className="relative min-h-[100dvh]">
      <img src={fondo} alt="" className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-ink/84" />
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="rise">
            <p className="text-xs tracking-[0.28em] text-ember uppercase">Tu secreto</p>
            <h1 className="font-saiyan mt-3 text-4xl leading-none text-paper md:text-6xl">ELIGE TU CARTA</h1>
            <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-stone-300">
              Esa carta es la que la CPU tiene que adivinar. Al hacer clic, la partida empieza.
            </p>
          </div>
          <button
            type="button"
            onClick={onVolver}
            className="btn"
          >
            Menú
          </button>
        </div>
        <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {PERSONAJES.map((personaje, indice) => (
            <li key={personaje.id} className="rise" style={{ animationDelay: `${indice * 35}ms` }}>
              <button
                type="button"
                onClick={() => onElegir(personaje)}
                className="w-full transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <Carta personaje={personaje} numero={indice + 1} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
