import { Sidebar } from "./Sidebar";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

export function StatsPage() {
  const navigate = useNavigate();

  const categoryData = [
    { name: "Roupas", value: 45, color: "#8B5E3C" },
    { name: "Eletrônicos", value: 25, color: "#C9A77A" },
    { name: "Móveis", value: 20, color: "#5A3825" },
    { name: "Livros", value: 30, color: "#EADDC7" },
    { name: "Outros", value: 15, color: "#F8F3E7" },
  ];

  const monthlyData = [
    { month: "Jan", doados: 12, reservados: 8 },
    { month: "Fev", doados: 15, reservados: 10 },
    { month: "Mar", doados: 18, reservados: 12 },
    { month: "Abr", doados: 22, reservados: 15 },
    { month: "Mai", doados: 28, reservados: 18 },
    { month: "Jun", doados: 35, reservados: 22 },
  ];

  const statusData = [
    { name: "Doados", value: 120, color: "#8B5E3C" },
    { name: "Reservados", value: 45, color: "#C9A77A" },
    { name: "Disponíveis", value: 85, color: "#5A3825" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage="stats" onNavigate={(page) => navigate(`/${page}`)} />
      
      <main className="flex-1 md:ml-0 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-[#5A3825] mb-2">Relatórios e Estatísticas</h1>
          <p className="text-[#8B5E3C]">
            Visualize o impacto da plataforma
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <p className="text-[#8B5E3C] text-sm mb-2">Total de Itens</p>
            <p className="text-[#3A2B1D] text-3xl">250</p>
            <p className="text-[#C9A77A] text-xs mt-1">+12% este mês</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <p className="text-[#8B5E3C] text-sm mb-2">Itens Doados</p>
            <p className="text-[#3A2B1D] text-3xl">120</p>
            <p className="text-[#C9A77A] text-xs mt-1">48% do total</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <p className="text-[#8B5E3C] text-sm mb-2">Usuários Ativos</p>
            <p className="text-[#3A2B1D] text-3xl">1,240</p>
            <p className="text-[#C9A77A] text-xs mt-1">+8% este mês</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <p className="text-[#8B5E3C] text-sm mb-2">Impacto CO₂</p>
            <p className="text-[#3A2B1D] text-3xl">2.5t</p>
            <p className="text-[#C9A77A] text-xs mt-1">Economizados</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <h3 className="text-[#5A3825] mb-6">Tendência Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EADDC7" />
                <XAxis dataKey="month" stroke="#8B5E3C" />
                <YAxis stroke="#8B5E3C" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F8F3E7",
                    border: "2px solid #C9A77A",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="doados" fill="#8B5E3C" name="Doados" />
                <Bar dataKey="reservados" fill="#C9A77A" name="Reservados" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <h3 className="text-[#5A3825] mb-6">Categorias Mais Populares</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F8F3E7",
                    border: "2px solid #C9A77A",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
          <h3 className="text-[#5A3825] mb-6">Status dos Itens</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#F8F3E7",
                  border: "2px solid #C9A77A",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}
