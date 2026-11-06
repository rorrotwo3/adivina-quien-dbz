import { useEffect, useRef, useState } from 'react'
import fondo from '../assets/background/fondo1.png'
import dorso from '../assets/background/tarjeta por atras opcion 2.jpg'
import { ATRIBUTOS, PERSONAJES, preguntaDe, type AtributoId, type Personaje } from '../data/knowledgeBase.ts'
import { RESPUESTAS, type Respuesta } from '../game/inference.ts'
import Carta from './Carta.tsx'

export type Linea = { id: number; autor: 'jugador' | 'cpu' | 'sistema'; texto: string }

type Props = {
  personajeJugador: Personaje
  turno: 'jugador' | 'cpu'
  preguntaCpu: AtributoId | null
  restantesJugador: string[]
  restantesCpu: string[]
  usadasJugador: AtributoId[]
  log: Linea[]
  onPreguntar: (id: AtributoId) => void
  onResponder: (respuesta: Respuesta) => void
  onAcusar: (id: string) => void
  onSalir: () => void
}

export default function Tablero({
  personajeJugador,
  turno,
  preguntaCpu,
  restantesJugador,
  restantesCpu,
  usadasJugador,
  log,
  onPreguntar,
  onResponder,
  onAcusar,
  onSalir,
}: Props) {
  const disponibles = ATRIBUTOS.filter((atributo) => !usadasJugador.includes(atributo.id))
  const activos = PERSONAJES.filter((personaje) => restantesJugador.includes(personaje.id))
  const [elegida, setElegida] = useState<AtributoId | ''>(disponibles[0]?.id ?? '')
  const [acusado, setAcusado] = useState(activos[0]?.id ?? '')
  const logRef = useRef<HTMLDivElement>(null)
  const preguntaLista = disponibles.some((atributo) => atributo.id === elegida)
    ? elegida
    : (disponibles[0]?.id ?? '')
  const acusadoLista = activos.some((personaje) => personaje.id === acusado)
    ? acusado
    : (activos[0]?.id ?? '')

  useEffect(() => {
    const nodo = logRef.current
    if (!nodo) return
    nodo.scrollTop = nodo.scrollHeight
  }, [log])

  return (
    <main className="relative min-h-[100dvh]">
      <img src={fondo} alt="" className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-paper/35" />
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.78fr)] lg:px-8">
        <section className="order-2 lg:order-1">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-saiyan text-sm tracking-wide text-ember">TABLERO</p>
              <h1 className="mt-2 text-2xl tracking-tight text-ink md:text-3xl">
                {activos.length} cartas vivas
              </h1>
            </div>
            <button type="button" onClick={onSalir} className="btn">
              Abandonar
            </button>
          </div>
          {activos.length === 0 && (
            <p className="mt-4 text-sm text-ember">No queda nadie en el tablero. La respuesta no cuadra con la base.</p>
          )}
          <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-6">
            {PERSONAJES.map((personaje, indice) => {
              const vivo = restantesJugador.includes(personaje.id)
              return (
                <li key={personaje.id} className={vivo ? 'transition-transform duration-300 hover:-translate-y-0.5' : ''}>
                  <Carta personaje={personaje} numero={indice + 1} bocaAbajo={!vivo} />
                </li>
              )
            })}
          </ul>
        </section>

        <aside className="order-1 flex flex-col gap-6 border-2 border-ink bg-paper/90 p-4 text-ink lg:sticky lg:top-6 lg:order-2 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-ember" />
            </span>
            <p className="text-sm">
              {turno === 'jugador' ? 'Tu turno' : 'Turno de la CPU'} · sospecha {restantesCpu.length}
            </p>
          </div>

          <div className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
            <img
              src={personajeJugador.imagen}
              alt=""
              className="h-16 w-16 border-2 border-ink bg-white object-contain"
            />
            <div>
              <p className="text-[11px] tracking-[0.16em] text-stone-400 uppercase">Tu carta</p>
              <p>{personajeJugador.nombre}</p>
            </div>
            <img src={dorso} alt="" className="h-16 w-16 border-2 border-ink object-cover" />
            <div>
              <p className="text-[11px] tracking-[0.16em] text-stone-400 uppercase">Carta de la CPU</p>
              <p>Boca abajo</p>
            </div>
          </div>

          <div className="border-t-2 border-ink pt-5">
            {preguntaCpu ? (
              <>
                <p className="text-[11px] tracking-[0.16em] text-ember uppercase">La CPU pregunta</p>
                <p className="mt-2 text-xl tracking-tight">{preguntaDe(preguntaCpu)}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {RESPUESTAS.map((opcion) => (
                    <button
                      key={opcion.id}
                      type="button"
                      className={`btn ${opcion.id === 'no_se' ? 'col-span-2' : ''}`}
                      onClick={() => onResponder(opcion.id)}
                    >
                      {opcion.texto}
                    </button>
                  ))}
                </div>
              </>
            ) : disponibles.length === 0 ? (
              <p className="text-sm leading-relaxed">
                No quedan preguntas. Acusa con las cartas que siguen vivas.
              </p>
            ) : (
              <form
                className="grid gap-2"
                onSubmit={(evento) => {
                  evento.preventDefault()
                  if (preguntaLista) onPreguntar(preguntaLista)
                }}
              >
                <label className="grid gap-2 text-sm" htmlFor="pregunta">
                  Pregunta
                  <select
                    id="pregunta"
                    value={preguntaLista}
                    disabled={turno !== 'jugador'}
                    onChange={(evento) => setElegida(evento.target.value as AtributoId)}
                    className="rounded-sm border-2 border-ink bg-white px-3 py-2.5"
                  >
                    {disponibles.map((atributo) => (
                      <option key={atributo.id} value={atributo.id}>
                        {atributo.pregunta}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-stone-500">La CPU responde con su carta secreta.</span>
                </label>
                <button
                  type="submit"
                  disabled={turno !== 'jugador' || !preguntaLista}
                  className="btn"
                >
                  Preguntar
                </button>
              </form>
            )}
          </div>

          {activos.length > 0 ? (
            <form
              className="grid gap-2 border-t-2 border-ink pt-5"
              onSubmit={(evento) => {
                evento.preventDefault()
                if (acusadoLista) onAcusar(acusadoLista)
              }}
            >
              <label className="grid gap-2 text-sm" htmlFor="acusar">
                Acusar
                <select
                  id="acusar"
                  value={acusadoLista}
                  disabled={turno !== 'jugador'}
                  onChange={(evento) => setAcusado(evento.target.value)}
                  className="rounded-sm border-2 border-ink bg-white px-3 py-2.5"
                >
                  {activos.map((personaje) => (
                    <option key={personaje.id} value={personaje.id}>
                      {personaje.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                disabled={turno !== 'jugador' || !acusadoLista}
                className="btn"
              >
                Es este
              </button>
            </form>
          ) : (
            <p className="border-t-2 border-ink pt-5 text-sm">Nadie a quien acusar.</p>
          )}

          <div ref={logRef} className="max-h-52 space-y-3 overflow-y-auto border-t-2 border-ink pt-5">
            {log.map((linea) => (
              <p key={linea.id} className="text-sm leading-relaxed">
                <span className="mr-2 text-[10px] tracking-[0.14em] text-ember uppercase">
                  {linea.autor === 'jugador' ? 'Tú' : linea.autor === 'cpu' ? 'CPU' : 'Mesa'}
                </span>
                {linea.texto}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}
