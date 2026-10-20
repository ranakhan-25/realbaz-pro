import Image from "next/image";
import residential from "@/assets/property-residential.jpg";
import commercial from "@/assets/property-commercial.jpg";
import mixed from "@/assets/property-mixed.jpg";

export type Property = {
  name: string;
  tag: string;
  meta: string;
  price: string;
  image: string;
};

export const PROPERTIES: Property[] = [
  {
    name: "Riverside Horizon",
    tag: "Residential",
    meta: "Gulshan 2 · 220 units · 2–3 BHK",
    price: "From ৳ 24.8M",
    image: residential.src,
  },
  {
    name: "Meridian Tower",
    tag: "Commercial",
    meta: "Banani · 14 floors · Grade-A office",
    price: "From ৳ 9.1M / yr",
    image: commercial.src,
  },
  {
    name: "Meridian Yards",
    tag: "Mixed-use",
    meta: "Bashundhara · 96 flats · retail podium",
    price: "From ৳ 18.3M",
    image: mixed.src,
  },
];

export function PropertyCard({ name, tag, meta, price, image }: Property) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative">
        <Image
          src={image}
          alt={name}
          width={1024}
          height={768}
          loading="lazy"
          className="aspect-4/3 w-full object-cover"
        />
        <span className="chip-kinetic absolute left-3 top-3">{tag}</span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-mono text-base font-medium">{price}</span>
          <span className="text-sm font-semibold text-foreground/70 transition group-hover:translate-x-1">
            View →
          </span>
        </div>
      </div>
    </article>
  );
}
