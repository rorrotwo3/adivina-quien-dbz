import dorso from '../assets/background/tarjeta por atras opcion 2.jpg'
import type { Personaje } from '../data/knowledgeBase.ts'

const MARCO: Record<string, string> = {
  goku: 'border-[#e2c01a]',
  gohan: 'border-[#e2c01a]',
  'gohan-saiyaman': 'border-[#e2c01a]',
  krilin: 'border-[#e2c01a]',
  roshi: 'border-[#e2c01a]',
  kaio: 'border-[#e2c01a]',
  vegeta: 'border-[#e2c01a]',
  gotenks: 'border-[#e2c01a]',
  trunks: 'border-[#e2c01a]',
  'gotenks-ssj3': 'border-[#d64545]',
  kami: 'border-[#d64545]',
  piccolo: 'border-[#d64545]',
  bulma: 'border-[#d64545]',
  'chi-chi': 'border-[#d64545]',
  'mr-satan': 'border-[#d64545]',
  raditz: 'border-[#d64545]',
  bardock: 'border-[#3c9a4a]',
  'goku-ssj': 'border-[#3c9a4a]',
  'goku-nino': 'border-[#3c9a4a]',
  vegetto: 'border-[#3c9a4a]',
  'vegetto-ssj': 'border-[#3c9a4a]',
  broly: 'border-[#3c9a4a]',
  buu: 'border-[#3c9a4a]',
  cell: 'border-[#3c9a4a]',
}

type Props = {
  personaje: Personaje
  numero: number
  bocaAbajo?: boolean
}

export default function Carta({ personaje, numero, bocaAbajo = false }: Props) {
  const marco = MARCO[personaje.id] ?? 'border-[#e2c01a]'
  return (
    <div className="[perspective:900px]">
      <div
        className={`relative aspect-[3/4] transition-transform duration-500 motion-reduce:transition-none [transform-style:preserve-3d] ${
          bocaAbajo ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div
          className={`absolute inset-0 flex flex-col border-[3px] bg-white shadow-[0_8px_16px_-12px_rgba(28,25,23,0.55)] [backface-visibility:hidden] ${marco}`}
        >
          <span
            className={`absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white text-[10px] font-semibold text-ink ${marco}`}
          >
            {numero}
          </span>
          <img src={personaje.imagen} alt="" className="min-h-0 flex-1 object-contain px-1 pt-5" />
          <p className="truncate bg-ink px-1 py-1 text-center text-[10px] tracking-wide text-paper uppercase">
            {personaje.nombre}
          </p>
        </div>
        <div className="absolute inset-0 overflow-hidden border-[3px] border-ink [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <img src={dorso} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}
