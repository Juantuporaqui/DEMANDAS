export type Evidencia = {
  id: string;
  tipo: 'email' | 'extracto' | 'factura' | 'escrito' | 'resolucion' | 'otro';
  titulo: string;
  fecha?: string;
  descripcionCorta: string;
  cuerpo?: string;
  bullets?: string[];
  riesgo?: {
    nivel: 'alto' | 'medio' | 'bajo';
    porQue: string[];
    mitigacion: string[];
  };
};

export const EMAIL_REGULARIZACION: Evidencia = {
  id: 'email-regularizacion-cuenta-ninos',
  tipo: 'email',
  titulo: 'Email: intento de regularización y control de cuenta',
  fecha: '',
  descripcionCorta:
    'Oferta de normalizar aportaciones y establecer control de retiradas; se invoca buena fe y cronología objetiva.',
  cuerpo: `Buenos días Vicen...
Voy a ir regularizando regularizando la cuenta de los niños, pero 200€ es mucho dinero, yo no puedo pagar tanto y los niños no necesitan 400€ al mes de gasto extra. La prueba es que en la cuenta hay un remanente muy alto.
Yo no llego a final de mes, y no puedo pagar tanto, entre otras cosas, porque me estás asfixiando económicamente, echándome de mi propia casa, no pagando tu mitad de la hipoteca que tenemos conjunta y bloqueando la venta de bienes que tenemos en común desde hace más de tres años..

Te propongo, bajar la cuota a 100 euros por cabeza y establecer un sistema de control para las retiradas de la cuenta, durante estos meses hay realizado numerosas retiradas, con las que no estoy de acuerdo.

De momento, iré poniéndome al día con los pagos, conforme pueda, la situación es complicada, el banco va a iniciar el proceso de embargo de la casa de Quart debido a que no pagas tus cuotas.

Tren en cuenta mi buena voluntad, un saludo.`,
  bullets: [
    'Propone regularizar y normalizar aportaciones (no bloqueo total).',
    'Cuestiona cuantía: 200€/mes por menor; propone 100€/menor.',
    'Pide control de retiradas y denuncia retiradas no acordadas.',
    'Aporta contexto económico (hipoteca/uso vivienda) como causa del conflicto.',
  ],
  riesgo: {
    nivel: 'alto',
    porQue: [
      'Puede interpretarse como reconocimiento de impago (“me pondré al día… conforme pueda”).',
      'Incluye afirmaciones emocionales (“asfixiando económicamente”) que pueden distraer del motivo tasado (pago/cuantía).',
    ],
    mitigacion: [
      'En el escrito, presentarlo como “oferta de regularización sin reconocimiento de deuda ni cuantía”, orientada a evitar litigio.',
      'Enfatizar que el debate es la liquidación/cómputo y la finalidad de la cuenta; el email solo prueba buena fe y cronología.',
    ],
  },
};

export const EVIDENCIAS_QUART: Evidencia[] = [EMAIL_REGULARIZACION];
