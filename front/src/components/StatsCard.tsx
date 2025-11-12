// src/components/StatsCard.tsx
interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: string;
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white border-2 border-[#C9A77A] rounded-xl p-6 shadow-lg flex flex-col items-center text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-[#5A3825] font-bold text-lg">{title}</h3>
      <p className="text-[#8B5E3C] text-xl mt-2">{value}</p>
    </div>
  );
}
