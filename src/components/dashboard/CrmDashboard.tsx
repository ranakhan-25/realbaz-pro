export default function CrmDashboard() {
  const cards = [
    { label: "Leads", value: "184", tone: "bg-sky-500/10 text-sky-600" },
    { label: "Deals", value: "41", tone: "bg-violet-500/10 text-violet-600" },
    { label: "Follow-ups", value: "26", tone: "bg-amber-500/10 text-amber-600" },
    { label: "Closed won", value: "12", tone: "bg-emerald-500/10 text-emerald-600" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {card.label}
            </div>
            <div className="mt-3 text-2xl font-display font-bold tracking-tight text-foreground">
              {card.value}
            </div>
            <div
              className={`mt-3 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${card.tone}`}
            >
              This month
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 text-sm font-semibold text-foreground">Pipeline overview</div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Hot", "9", "2 new this week"],
            ["Warm", "17", "5 revisits pending"],
            ["Cold", "15", "4 require follow-up"],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-lg border border-border bg-background p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </div>
              <div className="mt-3 text-3xl font-display font-bold text-foreground">{value}</div>
              <div className="mt-2 text-xs text-muted-foreground">{note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
