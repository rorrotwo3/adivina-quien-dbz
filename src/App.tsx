import { useRef, useState } from 'react'
import FinPartida from './components/FinPartida.tsx'
import Instrucciones from './components/Instrucciones.tsx'
import MenuPrincipal from './components/MenuPrincipal.tsx'
import SeleccionPersonaje from './components/SeleccionPersonaje.tsx'
import Tablero, { type Linea } from './components/Tablero.tsx'
import { PERSONAJES, porId, preguntaDe, type AtributoId, type Personaje } from './data/knowledgeBase.ts'
import {
  aplicarPeso,
  debeAcusar,
  filtrar,
  mejorPregunta,
  RESPUESTAS,
  vivosDe,
  type Respuesta,
} from './game/inference.ts'

type Pantalla = 'menu' | 'instructions' | 'character_select' | 'game' | 'game_over'

export default function App() {
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('menu')
  const [personajeJugador, setPersonajeJugador] = useState<Personaje | null>(null)
  const [personajeCPU, setPersonajeCPU] = useState<Personaje | null>(null)
  const [personajesRestantesJugador, setPersonajesRestantesJugador] = useState<string[]>([])
  const [pesosCpu, setPesosCpu] = useState<Record<string, number>>({})
  const [usadasJugador, setUsadasJugador] = useState<AtributoId[]>([])
  const [usadasCpu, setUsadasCpu] = useState<AtributoId[]>([])
  const [turno, setTurno] = useState<'jugador' | 'cpu'>('jugador')
  const [preguntaCpu, setPreguntaCpu] = useState<AtributoId | null>(null)
  const [ganador, setGanador] = useState<'jugador' | 'cpu' | null>(null)
  const [tituloFin, setTituloFin] = useState('')
  const [log, setLog] = useState<Linea[]>([])
  const lineaId = useRef(0)

  function anotar(autor: Linea['autor'], texto: string) {
    const id = ++lineaId.current
    setLog((previo) => [...previo, { id, autor, texto }])
  }

  function cerrar(resultado: 'jugador' | 'cpu', texto: string) {
    anotar('sistema', texto)
    setGanador(resultado)
    setTituloFin(texto)
    setPreguntaCpu(null)
    setPantallaActual('game_over')
  }

  function acusarCpu(acusado: Personaje, jugador: Personaje, texto: string) {
    const acierta = acusado.id === jugador.id
    anotar('cpu', texto)
    cerrar(
      acierta ? 'cpu' : 'jugador',
      acierta ? 'La CPU dio con la tuya.' : 'La CPU acusó a otra carta.',
    )
  }

  function turnoCpu(usadas: AtributoId[], pesos: Record<string, number>, jugador: Personaje) {
    const vivos = vivosDe(pesos)
    if (vivos.length <= 1) {
      if (!vivos[0]) {
        cerrar('jugador', 'La CPU se quedó sin cartas.')
        return
      }
      acusarCpu(vivos[0], jugador, `Acuso a ${vivos[0].nombre}.`)
      return
    }
    const pregunta = mejorPregunta(vivos, usadas)
    if (!pregunta) {
      const acusado = debeAcusar(pesos) ?? vivos[0]
      acusarCpu(acusado, jugador, `Ya no tengo preguntas. Acuso a ${acusado.nombre}.`)
      return
    }
    setPreguntaCpu(pregunta)
    setTurno('cpu')
    anotar('cpu', preguntaDe(pregunta))
  }

  function empezar(jugador: Personaje) {
    const cpu = PERSONAJES[Math.floor(Math.random() * PERSONAJES.length)]
    lineaId.current = 0
    setPersonajeJugador(jugador)
    setPersonajeCPU(cpu)
    setPersonajesRestantesJugador(PERSONAJES.map((personaje) => personaje.id))
    setPesosCpu(Object.fromEntries(PERSONAJES.map((personaje) => [personaje.id, 1])))
    setUsadasJugador([])
    setUsadasCpu([])
    setTurno('jugador')
    setPreguntaCpu(null)
    setGanador(null)
    setLog([{ id: ++lineaId.current, autor: 'sistema', texto: 'Tu turno. Pregunta de sí o no.' }])
    setPantallaActual('game')
  }

  function preguntar(atributo: AtributoId) {
    if (turno !== 'jugador' || !personajeCPU || !personajeJugador) return
    const respuesta = personajeCPU.atributos[atributo]
    const siguientes = filtrar(personajesRestantesJugador.map(porId), atributo, respuesta).map(
      (personaje) => personaje.id,
    )
    const usadas = [...usadasJugador, atributo]
    setUsadasJugador(usadas)
    setPersonajesRestantesJugador(siguientes)
    anotar('jugador', preguntaDe(atributo))
    anotar('cpu', respuesta ? 'Sí.' : 'No.')
    turnoCpu(usadasCpu, pesosCpu, personajeJugador)
  }

  function responder(respuesta: Respuesta) {
    if (!preguntaCpu || !personajeJugador) return
    const pesos = aplicarPeso(pesosCpu, preguntaCpu, respuesta)
    const usadas = [...usadasCpu, preguntaCpu]
    setPesosCpu(pesos)
    setUsadasCpu(usadas)
    setPreguntaCpu(null)
    const texto = RESPUESTAS.find((opcion) => opcion.id === respuesta)?.texto ?? respuesta
    anotar('jugador', `${texto}.`)
    const acusado = debeAcusar(pesos)
    if (!acusado) {
      if (vivosDe(pesos).length === 0) cerrar('jugador', 'La CPU se quedó sin cartas.')
      else setTurno('jugador')
      return
    }
    acusarCpu(acusado, personajeJugador, `Acuso a ${acusado.nombre}.`)
  }

  function acusar(id: string) {
    if (turno !== 'jugador' || !personajeCPU) return
    const nombre = porId(id).nombre
    anotar('jugador', `Acuso a ${nombre}.`)
    cerrar(
      id === personajeCPU.id ? 'jugador' : 'cpu',
      id === personajeCPU.id ? 'Nombraste la carta correcta.' : 'Esa no era la carta de la CPU.',
    )
  }

  if (pantallaActual === 'instructions') {
    return <Instrucciones onVolver={() => setPantallaActual('menu')} />
  }
  if (pantallaActual === 'character_select') {
    return (
      <SeleccionPersonaje onElegir={empezar} onVolver={() => setPantallaActual('menu')} />
    )
  }
  if (pantallaActual === 'game' && personajeJugador) {
    return (
      <Tablero
        personajeJugador={personajeJugador}
        turno={turno}
        preguntaCpu={preguntaCpu}
        restantesJugador={personajesRestantesJugador}
        restantesCpu={vivosDe(pesosCpu).map((personaje) => personaje.id)}
        usadasJugador={usadasJugador}
        log={log}
        onPreguntar={preguntar}
        onResponder={responder}
        onAcusar={acusar}
        onSalir={() => setPantallaActual('menu')}
      />
    )
  }
  if (pantallaActual === 'game_over' && ganador && personajeJugador && personajeCPU) {
    return (
      <FinPartida
        titulo={tituloFin}
        personajeJugador={personajeJugador}
        personajeCPU={personajeCPU}
        onMenu={() => setPantallaActual('menu')}
      />
    )
  }
  return (
    <MenuPrincipal
      onJugar={() => setPantallaActual('character_select')}
      onInstrucciones={() => setPantallaActual('instructions')}
    />
  )
}
