import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  color: string;
}

export function StatsCard({ icon: Icon, title, value, color }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md"
    >
      <div className="flex items-center gap-4">
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="h-8 w-8" style={{ color }} />
        </div>
        <div>
          <p className="text-[#8B5E3C] text-sm">{title}</p>
          <p className="text-[#3A2B1D] text-3xl mt-1">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
