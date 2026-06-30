interface Props {
  note: string;
}

export default function HonestyNote({ note }: Props) {
  return (
    <div className="mt-4 flex gap-2.5 rounded-lg border border-ink/10 bg-paper px-3.5 py-3 text-sm">
      <span aria-hidden="true" className="select-none">
        💡
      </span>
      <p className="text-muted">
        <span className="font-semibold text-ink">Honest take: </span>
        {note}
      </p>
    </div>
  );
}
