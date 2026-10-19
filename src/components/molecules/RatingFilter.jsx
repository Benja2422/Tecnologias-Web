import RadioFilter from './RadioFilter';

export const RATING_OPTIONS = [
  { value: '4', label: '4 estrellas o más' },
  { value: '3', label: '3 estrellas o más' },
  { value: '2', label: '2 estrellas o más' },
  { value: '0', label: 'Todos' },
];

/** Rating mínimo (número; 0 = sin filtro). */
export default function RatingFilter({ value, onChange }) {
  return <RadioFilter label="Rating mínimo" options={RATING_OPTIONS} value={String(value)} onChange={(v) => onChange(Number(v))} />;
}
