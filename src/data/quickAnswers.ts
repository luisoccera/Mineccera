export interface QuickAnswer {
  answer: string;
  id: string;
  question: string;
}

export const quickAnswers: QuickAnswer[] = [
  {
    answer:
      'Necesitas 35 diamantes para 1 set completo: 24 para armadura (casco 5, pechera 8, pantalones 7, botas 4) y 11 para herramientas (pico 3, espada 2, hacha 3, pala 1, azada 2).',
    id: 'diamonds-full-set',
    question: 'Cuantos diamantes necesito para herramientas + armadura completa?',
  },
  {
    answer:
      'Desde el cambio de generacion de 1.18+, el diamante aparece entre Y -64 y Y 16. Para minar de forma eficiente, la capa mas usada es Y -59.',
    id: 'diamond-layers',
    question: 'En que capas hay mayor concentracion de diamantes?',
  },
  {
    answer:
      'Para gastar menos XP en yunque, combina primero libros baratos entre si, luego libros caros, y aplica al objeto en pasos balanceados. Evita llegar a 40+ niveles en una sola operacion.',
    id: 'xp-order',
    question: 'Cual es el mejor orden de encantamientos para gastar menos XP?',
  },
];

const normalize = (input: string) =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const includesAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

export function answerQuestion(rawQuestion: string): string {
  const question = normalize(rawQuestion);

  if (!question.trim()) {
    return 'Escribeme algo como: "cuantos diamantes necesito para set completo?" o "capa ideal para diamantes".';
  }

  if (
    includesAny(question, ['diamante', 'diamantes']) &&
    includesAny(question, ['herramienta', 'armadura', 'set completo'])
  ) {
    return quickAnswers[0].answer;
  }

  if (
    includesAny(question, ['capa', 'capas', 'y -59', 'nivel y']) &&
    includesAny(question, ['diamante', 'diamantes'])
  ) {
    return quickAnswers[1].answer;
  }

  if (includesAny(question, ['encant', 'xp', 'experiencia', 'yunque', 'orden'])) {
    return quickAnswers[2].answer;
  }

  if (includesAny(question, ['seed', 'semilla', 'mapa', 'estructura'])) {
    return 'Usa la pestana Seed: pones semilla + coordenadas, eliges Java/Bedrock, y el mapa te muestra estructuras cercanas en la zona.';
  }

  return 'No tengo esa respuesta exacta aun, pero prueba con palabras clave como diamantes, capas, encantamientos, seed o estructuras.';
}
