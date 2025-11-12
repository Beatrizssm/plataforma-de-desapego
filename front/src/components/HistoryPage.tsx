// HistoryPage.tsx
import { Sidebar } from "./Sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

export function HistoryPage() {
  const navigate = useNavigate();

  const transactions = [
    {
      id: "1",
      item: "Camisetas Variadas",
      operation: "Doação",
      date: "01/10/2025",
      status: "completed",
    },
    {
      id: "2",
      item: "Laptop Dell Inspiron",
      operation: "Doação",
      date: "28/09/2025",
      status: "reserved",
    },
    {
      id: "3",
      item: "Cadeira de Madeira",
      operation: "Doação",
      date: "25/09/2025",
      status: "completed",
    },
    // ... demais transações
  ];

  const statusConfig = {
    completed: { label: "Concluído", color: "bg-green-600" },
    reserved: { label: "Reservado", color: "bg-amber-600" },
    cancelled: { label: "Cancelado", color: "bg-red-600" },
  };

  return (
    <div className="flex min-h-screen bg-[#F8F3E7]">
      <Sidebar currentPage="history" onNavigate={(page) => navigate(`/${page}`)} />

      <main className="flex-1 md:ml-0 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-[#5A3825] mb-2">Histórico de Transações</h1>
          <p className="text-[#8B5E3C]">
            Visualize todas as suas doações e reservas
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-[#C9A77A] shadow-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#EADDC7]">
                <TableHead className="text-[#5A3825]">Item</TableHead>
                <TableHead className="text-[#5A3825]">Tipo de Operação</TableHead>
                <TableHead className="text-[#5A3825]">Data</TableHead>
                <TableHead className="text-[#5A3825]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow
                  key={transaction.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#F8F3E7]"}
                >
                  <TableCell className="text-[#3A2B1D]">{transaction.item}</TableCell>
                  <TableCell className="text-[#8B5E3C]">{transaction.operation}</TableCell>
                  <TableCell className="text-[#8B5E3C]">{transaction.date}</TableCell>
                  <TableCell>
                    <Badge className={`${statusConfig[transaction.status as keyof typeof statusConfig].color} text-white`}>
                      {statusConfig[transaction.status as keyof typeof statusConfig].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <p className="text-[#8B5E3C] text-sm mb-2">Total de Doações</p>
            <p className="text-[#3A2B1D] text-3xl">15</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <p className="text-[#8B5E3C] text-sm mb-2">Itens Reservados</p>
            <p className="text-[#3A2B1D] text-3xl">3</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-[#C9A77A] shadow-md">
            <p className="text-[#8B5E3C] text-sm mb-2">Este Mês</p>
            <p className="text-[#3A2B1D] text-3xl">5</p>
          </div>
        </div>
      </main>
    </div>
  );
}
