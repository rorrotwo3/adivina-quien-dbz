import bardock from '../assets/card/BardockSaiyan-Photoroom.png'
import broly from '../assets/card/Broly.png'
import bulma from '../assets/card/Bulma.png'
import cell from '../assets/card/Cell_Perfecto.png'
import chichi from '../assets/card/Chichi.png'
import saiyaman from '../assets/card/Gohan Uni.png'
import gohan from '../assets/card/gohan.png'
import gokuSsj from '../assets/card/Goku ssj.png'
import goku from '../assets/card/Goku.png'
import gotenksSsj3 from '../assets/card/Gotenks ssj3.png'
import gotenks from '../assets/card/Gotenksz.png'
import kaio from '../assets/card/kaiosama.png'
import kami from '../assets/card/Kamisama.png'
import krilin from '../assets/card/krilinz.png'
import roshi from '../assets/card/maestro roshi.png'
import satan from '../assets/card/mr satanz.png'
import piccolo from '../assets/card/Piccolo.png'
import raditz from '../assets/card/Raditz.png'
import gokuNino from '../assets/card/Son Goku.png'
import buu from '../assets/card/super boo.png'
import trunks from '../assets/card/trunks.png'
import vegeta from '../assets/card/Vegeta.png'
import vegettoSsj from '../assets/card/Vegeto ssj.png'
import vegetto from '../assets/card/Vegetto-Photoroom.png'

export const ATRIBUTOS = [
  { id: 'es_saiyajin', pregunta: '¿Es saiyajin?' },
  { id: 'es_calvo', pregunta: '¿Es calvo?' },
  { id: 'es_villano', pregunta: '¿Es un villano?' },
  { id: 'tiene_cola', pregunta: '¿Tiene cola?' },
  { id: 'usa_espada', pregunta: '¿Usa espada?' },
  { id: 'ha_muerto', pregunta: '¿Muere en la historia?' },
  { id: 'es_mujer', pregunta: '¿Es mujer?' },
  { id: 'es_fusion', pregunta: '¿Es una fusión?' },
  { id: 'cabello_dorado', pregunta: '¿Tiene el cabello dorado?' },
  { id: 'piel_verde', pregunta: '¿Tiene la piel verde?' },
  { id: 'usa_armadura', pregunta: '¿Usa armadura saiyajin?' },
  { id: 'es_nino', pregunta: '¿Es un niño?' },
  { id: 'usa_gi', pregunta: '¿Viste un gi de pelea?' },
  { id: 'es_dios', pregunta: '¿Es un dios?' },
] as const

export type AtributoId = (typeof ATRIBUTOS)[number]['id']

export type Personaje = {
  id: string
  nombre: string
  imagen: string
  atributos: Record<AtributoId, boolean>
}

// shortcut: los bits siguen el orden de ATRIBUTOS; si reordenas las preguntas, reescribe cada ficha.
function ficha(id: string, nombre: string, imagen: string, bits: string): Personaje {
  if (bits.length !== ATRIBUTOS.length || /[^01]/.test(bits)) {
    throw new Error(`Ficha inválida: ${nombre}`)
  }
  const atributos = {} as Record<AtributoId, boolean>
  ATRIBUTOS.forEach((atributo, indice) => {
    atributos[atributo.id] = bits[indice] === '1'
  })
  return { id, nombre, imagen, atributos }
}

export const PERSONAJES: Personaje[] = [
  ficha('goku', 'Goku', goku, '10000100000010'),
  ficha('goku-ssj', 'Goku Super Saiyajin', gokuSsj, '10000100100010'),
  ficha('goku-nino', 'Goku niño', gokuNino, '10010100000100'),
  ficha('vegeta', 'Vegeta', vegeta, '10100100001000'),
  ficha('gohan', 'Gohan', gohan, '10000000000010'),
  ficha('gohan-saiyaman', 'Gohan (Saiyaman)', saiyaman, '10000000000000'),
  ficha('bardock', 'Bardock', bardock, '10000100001000'),
  // shortcut: la cola de Raditz no se ve de frente; pasa a 0 si el arte deja de incluirla.
  ficha('raditz', 'Raditz', raditz, '10110100001000'),
  ficha('broly', 'Broly', broly, '10100100000000'),
  ficha('trunks', 'Trunks', trunks, '10001000000000'),
  ficha('gotenks', 'Gotenks', gotenks, '10000001000110'),
  ficha('gotenks-ssj3', 'Gotenks Super Saiyajin 3', gotenksSsj3, '10000001100110'),
  ficha('vegetto', 'Vegetto', vegetto, '10000001000010'),
  ficha('vegetto-ssj', 'Vegetto Super Saiyajin', vegettoSsj, '10000001100010'),
  ficha('cell', 'Cell', cell, '01100100010000'),
  ficha('piccolo', 'Piccolo', piccolo, '01000100010010'),
  ficha('bulma', 'Bulma', bulma, '00000010000000'),
  ficha('chi-chi', 'Chi-Chi', chichi, '00000110000000'),
  ficha('krilin', 'Krilin', krilin, '01000100000010'),
  ficha('roshi', 'Maestro Roshi', roshi, '01000100000000'),
  ficha('mr-satan', 'Mr. Satán', satan, '00000000000000'),
  ficha('kaio', 'Kaio-sama', kaio, '01000100000001'),
  ficha('kami', 'Kami-sama', kami, '01000100010001'),
  ficha('buu', 'Super Buu', buu, '00100100000000'),
]

const firmas = new Map<string, string>()
for (const personaje of PERSONAJES) {
  const firma = ATRIBUTOS.map((atributo) => (personaje.atributos[atributo.id] ? '1' : '0')).join('')
  const previo = firmas.get(firma)
  if (previo) throw new Error(`Atributos iguales: ${previo} y ${personaje.nombre}`)
  firmas.set(firma, personaje.nombre)
}

export function preguntaDe(id: AtributoId) {
  const atributo = ATRIBUTOS.find((item) => item.id === id)
  if (!atributo) throw new Error(id)
  return atributo.pregunta
}

export function porId(id: string) {
  const personaje = PERSONAJES.find((item) => item.id === id)
  if (!personaje) throw new Error(id)
  return personaje
}
