import fondo from '../assets/background/fondo1.png'
import { PERSONAJES } from '../data/knowledgeBase.ts'

type Props = {
  onJugar: () => void
  onInstrucciones: () => void
}

export default function MenuPrincipal({ onJugar, onInstrucciones }: Props) {
  const muestra = ['vegeta', 'goku', 'trunks'].map((id) => {
    const personaje = PERSONAJES.find((item) => item.id === id)
    if (!personaje) throw new Error(id)
    return personaje
  })

  return (
    <main className="relative min-h-[100dvh]">
      <img
        src={fondo}
        alt=""
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-ink/78" />
      <div className="mx-auto grid min-h-[100dvh] max-w-[1400px] items-end gap-10 px-4 py-8 md:grid-cols-[1.35fr_0.75fr] md:items-center md:px-8">
        <div className="rise max-w-xl">
          <p className="text-xs tracking-[0.28em] text-ember uppercase">Dragon Ball</p>
          <h1 className="font-saiyan mt-4 text-4xl leading-none text-paper md:text-6xl">
            ADIVINA QUIEN
            <span className="mt-2 block text-ember">ANTES QUE LA CPU</span>
          </h1>
          <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-stone-300">
            Eliges una carta. La CPU elige otra. Preguntas de sí o no, por turnos, hasta
            nombrar al personaje oculto del rival.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn" onClick={onJugar}>
              Jugar
            </button>
            <button type="button" className="btn" onClick={onInstrucciones}>
              Cómo jugar
            </button>
          </div>
        </div>
        <div className="relative h-64 w-full overflow-hidden md:h-[460px]">
          <img
            src={muestra[0].imagen}
            alt=""
            className="rise absolute bottom-0 left-0 h-4/5 w-auto object-contain"
            style={{ animationDelay: '80ms' }}
          />
          <img
            src={muestra[1].imagen}
            alt=""
            className="rise absolute bottom-0 left-[26%] h-full w-auto object-contain md:left-[18%]"
          />
          <img
            src={muestra[2].imagen}
            alt=""
            className="rise absolute right-0 bottom-0 h-[85%] w-auto object-contain"
            style={{ animationDelay: '160ms' }}
          />
        </div>
      </div>
    </main>
  )
}
