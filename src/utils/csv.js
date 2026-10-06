// Evita que Excel interprete celdas como fórmulas (=, +, -, @)
const sanitize = (value) => {
  const text = String(value ?? '');
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
};
const escapeCell = (value) => `"${sanitize(value).replace(/"/g, '""')}"`;

/** columns: [{ header, value: (row) => any }] */
export function downloadCsv(filename, rows, columns) {
  const lines = [
    columns.map((c) => escapeCell(c.header)).join(','),
    ...rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(',')),
  ];
  // BOM para que Excel respete los acentos
  const blob = new Blob(['\uFEFF', lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
