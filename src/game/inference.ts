import { ATRIBUTOS, PERSONAJES, type AtributoId, type Personaje } from '../data/knowledgeBase.ts'

export type Respuesta = 'si' | 'no' | 'no_se' | 'probable_si' | 'probable_no'

export const RESPUESTAS: { id: Respuesta; texto: string }[] = [
  { id: 'si', texto: 'Sí' },
  { id: 'no', texto: 'No' },
  { id: 'probable_si', texto: 'Probablemente sí' },
  { id: 'probable_no', texto: 'Probablemente no' },
  { id: 'no_se', texto: 'No lo sé' },
]

/** Pregunta que más se acerca a partir el grupo vivo por la mitad. */
export function mejorPregunta(
  restantes: Personaje[],
  usadas: readonly AtributoId[],
): AtributoId | null {
  let mejor: AtributoId | null = null
  let mejorDistancia = 1
  for (const atributo of ATRIBUTOS) {
    if (usadas.includes(atributo.id)) continue
    let si = 0
    for (const personaje of restantes) if (personaje.atributos[atributo.id]) si += 1
    if (si === 0 || si === restantes.length) continue
    const distancia = Math.abs(si / restantes.length - 0.5)
    if (distancia < mejorDistancia) {
      mejorDistancia = distancia
      mejor = atributo.id
    }
  }
  return mejor
}

export function filtrar(restantes: Personaje[], atributo: AtributoId, respuesta: boolean) {
  return restantes.filter((personaje) => personaje.atributos[atributo] === respuesta)
}

function factor(valor: boolean, respuesta: Respuesta) {
  if (respuesta === 'no_se') return 1
  if (respuesta === 'si') return valor ? 1 : 0
  if (respuesta === 'no') return valor ? 0 : 1
  if (respuesta === 'probable_si') return valor ? 1 : 0.2
  return valor ? 0.2 : 1
}

export function aplicarPeso(
  pesos: Record<string, number>,
  atributo: AtributoId,
  respuesta: Respuesta,
) {
  const siguiente: Record<string, number> = {}
  for (const personaje of PERSONAJES) {
    const base = pesos[personaje.id] ?? 0
    siguiente[personaje.id] = base <= 0 ? 0 : base * factor(personaje.atributos[atributo], respuesta)
  }
  return siguiente
}

export function vivosDe(pesos: Record<string, number>) {
  return PERSONAJES.filter((personaje) => (pesos[personaje.id] ?? 0) > 0)
}

/** Acusa si queda uno, o si uno concentra la probabilidad. */
export function debeAcusar(pesos: Record<string, number>) {
  const vivos = vivosDe(pesos)
  if (vivos.length === 0) return null
  if (vivos.length === 1) return vivos[0]
  const total = vivos.reduce((suma, personaje) => suma + pesos[personaje.id], 0)
  const top = vivos.reduce((mejor, personaje) =>
    pesos[personaje.id] > pesos[mejor.id] ? personaje : mejor,
  )
  if (pesos[top.id] / total >= 0.62) return top
  return null
}

const base = Object.fromEntries(PERSONAJES.map((personaje) => [personaje.id, 1]))
const duro = aplicarPeso(base, 'es_mujer', 'no')
if (duro.bulma !== 0 || duro.goku !== 1) throw new Error('el no tiene que eliminar solo a quien cumple')
const blando = aplicarPeso(base, 'es_mujer', 'probable_no')
if (blando.bulma === 0 || blando.goku !== 1) throw new Error('el probablemente no baja el peso, no borra')
