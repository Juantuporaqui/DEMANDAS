const PICASSENT_SEPARACION = { iso: '2022-08-01', human: '08/2022' } as const;
const PICASSENT_DIVORCIO = { iso: '2023-10-17', human: '17/10/2023' } as const;
const PICASSENT_DEMANDA = { iso: '2024-06-24', human: '24/06/2024' } as const;

export const PICASSENT_FACTS = {
  // FIX: canonical date
  matrimonio: { iso: '2013-08-09', human: '09/08/2013' },
  separacion: PICASSENT_SEPARACION,
  divorcio: PICASSENT_DIVORCIO,
  demanda: PICASSENT_DEMANDA,
  alquilerTuristico: {
    canal: 'TripAdvisor',
    licencia: true,
    nota: 'Con licencia de alojamiento turístico (nº/fecha: pendiente de concretar si no consta en autos).',
  },
  formacionActora: 'Máster impartido por la Cámara de Comercio (formación económico-empresarial).',
  reclamacionExtrajudicial: {
    short: 'No consta reclamación extrajudicial fehaciente previa a la demanda.',
    long: `Desde 2006 y durante la convivencia, la separación (${PICASSENT_SEPARACION.human}) y el divorcio (${PICASSENT_DIVORCIO.human}), hasta la demanda (${PICASSENT_DEMANDA.human}), no consta (ni se aporta) una sola reclamación extrajudicial fehaciente (correo/burofax) reclamando cantidad alguna o afirmando pago en exceso.`,
    sala: 'En un periodo de casi dos décadas —desde 2006, pasando por separación y divorcio— no consta una sola reclamación extrajudicial fehaciente previa a la demanda. Ese silencio excluye la interrupción del art. 1973 CC y refuerza el retraso desleal (art. 7 CC).',
  },
  dinamicaPatrimonial:
    'Dinámica de inversión/explotación patrimonial (chalet turístico, piso en Valencia para alquiler/venta, negocio de pádel indoor, producción agraria superintensiva, etc.).',
} as const;
