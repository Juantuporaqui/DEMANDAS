import type { Nomina, GastoPersonal, Activo, Evidencia, AuditoriaGastos } from '../types';

// Nóminas comparativas Juan vs Vicenta (2016-2022)
export const nominas: Nomina[] = [
  // 2016
  { periodo: '2016', año: 2016, mes: 0, juan: 28500, vicenta: 18200 },
  // 2017
  { periodo: '2017', año: 2017, mes: 0, juan: 29800, vicenta: 18900 },
  // 2018
  { periodo: '2018', año: 2018, mes: 0, juan: 31200, vicenta: 19500 },
  // 2019
  { periodo: '2019', año: 2019, mes: 0, juan: 32500, vicenta: 20100 },
  // 2020
  { periodo: '2020', año: 2020, mes: 0, juan: 33800, vicenta: 20800 },
  // 2021
  { periodo: '2021', año: 2021, mes: 0, juan: 35200, vicenta: 21500 },
  // 2022
  { periodo: '2022', año: 2022, mes: 0, juan: 36500, vicenta: 22000 },
];

// Gastos personales de Vicenta con dinero del fondo de hijos
export const gastosVicentaPersonal: GastoPersonal[] = [
  {
    id: 'gv-01',
    categoria: 'Perfumería',
    concepto: 'Druni - Cosméticos y perfumes',
    importe: 845.30,
    fecha: '2023-2024',
    pagadoPor: 'vicenta',
    tipoGasto: 'personal',
    documentoRef: 'Extracto Cuenta Hijos',
  },
  {
    id: 'gv-02',
    categoria: 'Mascotas',
    concepto: 'Tienda de mascotas - Alimentación y accesorios',
    importe: 623.45,
    fecha: '2023-2024',
    pagadoPor: 'vicenta',
    tipoGasto: 'personal',
    documentoRef: 'Extracto Cuenta Hijos',
  },
  {
    id: 'gv-03',
    categoria: 'Ropa',
    concepto: 'Tiendas de ropa - Prendas personales',
    importe: 756.20,
    fecha: '2023-2024',
    pagadoPor: 'vicenta',
    tipoGasto: 'personal',
    documentoRef: 'Extracto Cuenta Hijos',
  },
  {
    id: 'gv-04',
    categoria: 'Perfumería',
    concepto: 'Otras perfumerías',
    importe: 485.66,
    fecha: '2023-2024',
    pagadoPor: 'vicenta',
    tipoGasto: 'personal',
    documentoRef: 'Extracto Cuenta Hijos',
  },
];

// Pagos directos de Juan a los hijos
export const pagosJuanHijos: GastoPersonal[] = [
  {
    id: 'pj-01',
    categoria: 'Tecnología',
    concepto: 'iPad para estudios',
    importe: 649.00,
    fecha: '2023-09-15',
    pagadoPor: 'juan',
    tipoGasto: 'hijos',
    documentoRef: 'Factura Apple Store',
  },
  {
    id: 'pj-02',
    categoria: 'Tecnología',
    concepto: 'Ordenador portátil',
    importe: 899.00,
    fecha: '2024-01-20',
    pagadoPor: 'juan',
    tipoGasto: 'hijos',
    documentoRef: 'Factura MediaMarkt',
  },
  {
    id: 'pj-03',
    categoria: 'Salud',
    concepto: 'Gafas graduadas hijo mayor',
    importe: 215.00,
    fecha: '2023-11-10',
    pagadoPor: 'juan',
    tipoGasto: 'hijos',
    documentoRef: 'Factura Óptica',
  },
  {
    id: 'pj-04',
    categoria: 'Salud',
    concepto: 'Revisión y gafas hijo menor',
    importe: 132.65,
    fecha: '2024-03-05',
    pagadoPor: 'juan',
    tipoGasto: 'hijos',
    documentoRef: 'Factura Óptica',
  },
];

// Cálculo de auditoría de gastos
export const auditoriaGastos: AuditoriaGastos = {
  vicentaPersonal: 2710.61,
  juanDirectoHijos: 1895.65,
  saldoCompensable: 881.88, // Diferencia entre lo reclamado (2400) y lo que Juan tiene a favor
  detalleVicenta: gastosVicentaPersonal,
  detalleJuan: pagosJuanHijos,
};

// Activos y su carácter
export const activos: Activo[] = [
  {
    id: 'act-01',
    nombre: 'Vivienda Lope de Vega',
    tipo: 'inmueble',
    caracter: 'privativo',
    titular: 'juan',
    valorEstimado: 180000,
    fechaAdquisicion: '2000-03-15',
    documentacion: 'Escritura de compraventa año 2000 - Adquirido antes del matrimonio',
  },
  {
    id: 'act-02',
    nombre: 'Olivar - Explotación agrícola',
    tipo: 'negocio',
    caracter: 'privativo',
    titular: 'juan',
    valorEstimado: 45000,
    fechaAdquisicion: '1998-06-01',
    documentacion: 'Herencia familiar - Carácter privativo por subrogación real',
  },
  {
    id: 'act-03',
    nombre: 'Vivienda Vicenta (alquilada)',
    tipo: 'inmueble',
    caracter: 'privativo',
    titular: 'vicenta',
    valorEstimado: 150000,
    fechaAdquisicion: '2005-01-01',
    documentacion: 'Propiedad privativa de Vicenta - Actualmente alquilada',
  },
];

// Datos del Olivar 2021
export const olivar2021 = {
  beneficioBruto: 15369.00,
  gastos: {
    maquinaria: 4500.00,
    mantenimiento: 2100.00,
    otros: 1200.00,
  },
  beneficioNeto: 7569.00,
  reinvertido: 4500.00,
  concepto: 'Beneficios reinvertidos en maquinaria agrícola para mejora de la explotación',
};

// Evidencias de mala fe
export const evidenciasMalaFe: Evidencia[] = [
  {
    id: 'ev-01',
    tipo: 'email',
    fecha: '2025-01-12',
    descripcion: 'Email donde Vicenta admite alquilar su vivienda privativa',
    contenido: 'En comunicación del 12/01/2025, Vicenta reconoce tener alquilada su vivienda privativa mientras reclama "situación de asfixia económica" en los procedimientos judiciales.',
    relevancia: 'mala_fe',
  },
  {
    id: 'ev-02',
    tipo: 'documento',
    fecha: '2022-03-15',
    descripcion: 'Retirada desproporcionada de fondos venta Artur Piera',
    contenido: 'De los 120.000€ de la venta del inmueble de Artur Piera, Vicenta retiró 6.500€ más que Juan, a pesar de corresponder partes iguales.',
    relevancia: 'favorable',
  },
  {
    id: 'ev-03',
    tipo: 'declaracion',
    fecha: '2024-05-10',
    descripcion: 'Contradicción en la demanda sobre aportaciones',
    contenido: 'En la demanda se afirma que Juan no aportaba al hogar, pero los extractos bancarios demuestran que Juan ingresaba el 60% de los gastos comunes.',
    relevancia: 'contradiccion',
  },
];

// Datos para gráfico de trazabilidad Artur Piera
export const ventaArturPiera = {
  total: 120000,
  destinoJuan: 56750,
  destinoVicenta: 63250,
  diferencia: 6500,
  fecha: '2022-03-01',
  notas: 'Vicenta retiró 6.500€ más que Juan de la cuenta común donde se depositó el importe de la venta',
};

// Datos para gráfico de compensación Quart
export const calculoCompensacion = {
  reclamacionVicenta: 2400.00,
  gastosPersonalesVicenta: 2710.61,
  pagosDirectosJuan: 1895.65,
  totalAFavorJuan: 2710.61 + 1895.65, // 4606.26
  saldoFinal: 2400.00 - 2710.61, // -310.61 (a favor de Juan)
};
