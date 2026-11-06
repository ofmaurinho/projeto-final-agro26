function doisDigitos(valor: number) {
  return String(valor).padStart(2, "0");
}

export function formatarData(data: Date) {
  return `${doisDigitos(data.getDate())}/${doisDigitos(
    data.getMonth() + 1,
  )}/${data.getFullYear()}`;
}

export function converterDataBrasileira(valor: string): Date | null {
  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(valor);
  if (!partes) return null;

  const dia = Number(partes[1]);
  const mes = Number(partes[2]);
  const ano = Number(partes[3]);
  const data = new Date(ano, mes - 1, dia, 12);

  if (
    data.getDate() !== dia ||
    data.getMonth() !== mes - 1 ||
    data.getFullYear() !== ano
  ) {
    return null;
  }

  return data;
}
