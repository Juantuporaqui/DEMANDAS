interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

export function printElementAsDocument({ title }: PrintElementOptions): void {
  // Guardamos el título original de tu app
  const originalTitle = document.title;
  
  // Cambiamos el título para que al exportar a PDF, el archivo se llame como tú quieres
  document.title = title;
  
  // Usamos el motor de impresión nativo del navegador (100% fiable)
  window.print();
  
  // Restauramos el título original
  document.title = originalTitle;
}
