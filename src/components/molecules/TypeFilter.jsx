import RadioFilter from './RadioFilter';

export const TYPE_OPTIONS = [
  { value: 'productos', label: 'Productos' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'ambos', label: 'Ambos' },
];

export const DEFAULT_TYPE = 'productos';

/** Tipo de publicación: 'productos' | 'servicios' | 'ambos'. */
export default function TypeFilter({ value, onChange }) {
  return <RadioFilter label="Tipo" options={TYPE_OPTIONS} value={value} onChange={onChange} />;
}
