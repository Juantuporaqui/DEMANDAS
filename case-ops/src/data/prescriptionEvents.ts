export type PrescriptionEvent = {
  id: string;
  fecha: string;
  tipo: 'hecho' | 'norma' | 'umbral' | 'demanda';
  desc: string;
  estado?: 'prescrito';
};

export const prescriptionEvents: PrescriptionEvent[] = [
  {
    id: 'H1',
    fecha: '2008-09-05',
    tipo: 'hecho',
    desc: 'Cancelación Préstamos (20.085€)',
    estado: 'prescrito',
  },
  {
    id: 'H2',
    fecha: '2014-10-28',
    tipo: 'hecho',
    desc: 'Compra Seat León',
    estado: 'prescrito',
  },
  {
    id: 'H3',
    fecha: '2006-08-22',
    tipo: 'hecho',
    desc: 'Amortización Hipoteca 2006',
    estado: 'prescrito',
  },
  {
    id: 'L1',
    fecha: '2015-10-07',
    tipo: 'norma',
    desc: 'Reforma del art. 1964 CC (plazo 5 años)',
  },
  {
    id: 'L2',
    fecha: '2020-10-07',
    tipo: 'umbral',
    desc: 'Umbral orientativo 5 años (depende de interrupción)',
  },
  {
    id: 'D1',
    fecha: '2024-10-01',
    tipo: 'demanda',
    desc: 'Interposición Demanda',
  },
];
