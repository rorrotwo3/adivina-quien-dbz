import fondo from '../assets/background/fondo1.png'

const pasos = [
  'Elige tu carta secreta. La CPU sortea la suya en el mismo mazo.',
  'En tu turno haces una pregunta de sí o no. Las cartas que no encajan se apagan en el tablero.',
  'La CPU pregunta lo que más parte a la mitad a los sospechosos que le quedan. Tú respondes sí o no.',
  'Cuando estés seguro, acusa. Si fallas, pierdes. Si a la CPU le queda una sola carta, acusa en su turno.',
]

type Props = { onVolver: () => void }

export default function Instrucciones({ onVolver }: Props) {
  return (
    <main className="relative min-h-[100dvh]">
      <img src={fondo} alt="" className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-ink/82" />
      <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] items-center px-4 py-8 md:px-8">
        <div className="rise w-full max-w-xl">
          <p className="text-xs tracking-[0.28em] text-ember uppercase">Reglas</p>
          <h1 className="font-saiyan mt-3 text-4xl leading-none text-paper md:text-6xl">COMO JUGAR</h1>
          <ol className="mt-8 divide-y divide-stone-700 border-y border-stone-700">
            {pasos.map((paso, indice) => (
              <li key={paso} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                <span className="font-medium text-ember">0{indice + 1}</span>
                <p className="text-base leading-relaxed text-stone-300">{paso}</p>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={onVolver}
            className="btn mt-8"
          >
            Volver
          </button>
        </div>
      </div>
    </main>
  )
}
