export interface EscenarioVista {
  tipo: 'favorable' | 'neutral' | 'hostil';
  titulo: string;
  mensaje60s: string;
  puntosAClavar: string[];
  queConceder: string[];
  planB: string[];
  documentosDeMano: string[];
}

export interface RefutacionItem {
  alegacion: string;
  prueba: string;
  documentId?: string;
  documentTitle?: string;
  page?: number;
}
