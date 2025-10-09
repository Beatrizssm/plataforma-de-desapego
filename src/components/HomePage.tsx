import { motion } from "motion/react";
import { Shirt, Laptop, Armchair, BookOpen, ArrowRight, Heart, Recycle, Users } from "lucide-react";
import { CardItem } from "./CardItem";
import { Button } from "./ui/button";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const categories = [
    { icon: Shirt, name: "Roupas", color: "#8B5E3C" },
    { icon: Laptop, name: "Eletrônicos", color: "#C9A77A" },
    { icon: Armchair, name: "Móveis", color: "#5A3825" },
    { icon: BookOpen, name: "Livros", color: "#EADDC7" },
  ];

  const recentItems = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1626477357166-ed26f0e3f1cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2xvdGhpbmclMjByYWNrfGVufDF8fHx8MTc1OTk2MzAyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Camisetas Variadas",
      description: "Lote de camisetas em ótimo estado",
      status: "available" as const,
      category: "Roupas",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1654360057953-81305834dd30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwZGV2aWNlcyUyMGxhcHRvcHxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Laptop Dell",
      description: "Laptop Dell i5, 8GB RAM, funcionando perfeitamente",
      status: "reserved" as const,
      category: "Eletrônicos",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1702018706865-e5306a8fa007?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBmdXJuaXR1cmUlMjBjaGFpcnxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Cadeira de Madeira",
      description: "Linda cadeira de madeira artesanal",
      status: "available" as const,
      category: "Móveis",
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1680537250732-6835b59c937e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFjayUyMGJvb2tzJTIwbGlicmFyeXxlbnwxfHx8fDE3NTk5NjMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Coleção de Livros",
      description: "Diversos livros de literatura clássica",
      status: "donated" as const,
      category: "Livros",
    },
  ];

  const features = [
    {
      icon: Heart,
      title: "Doe com Propósito",
      description: "Ajude quem precisa doando itens que você não usa mais",
    },
    {
      icon: Recycle,
      title: "Sustentabilidade",
      description: "Contribua para um planeta mais limpo e consciente",
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Conecte-se com pessoas que compartilham seus valores",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F3E7]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EADDC7] to-[#F8F3E7] border-b-4 border-[#C9A77A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl mb-6 text-[#5A3825]">
              Desapegue com propósito.
            </h1>
            <p className="text-xl md:text-2xl text-[#8B5E3C] mb-8 max-w-3xl mx-auto">
              Doe, troque e transforme vidas.
            </p>
            <Button
              onClick={() => onNavigate("items")}
              className="bg-[#5A3825] hover:bg-[#8B5E3C] text-[#F8F3E7] px-8 py-6 rounded-xl"
            >
              Explorar Itens <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 opacity-10">
            <Recycle className="h-32 w-32 text-[#5A3825]" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-10">
            <Heart className="h-40 w-40 text-[#8B5E3C]" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="bg-[#EADDC7] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-[#5A3825]" />
                  </div>
                  <h3 className="text-[#3A2B1D] mb-2">{feature.title}</h3>
                  <p className="text-[#8B5E3C]">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-[#5A3825] mb-12">Categorias</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate("items")}
                  className="bg-white p-8 rounded-xl border-2 border-[#C9A77A] hover:border-[#8B5E3C] transition-all shadow-md"
                >
                  <Icon className="h-12 w-12 mx-auto mb-4" style={{ color: category.color }} />
                  <p className="text-[#3A2B1D]">{category.name}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-[#5A3825]">Itens Recentes</h2>
            <Button
              variant="outline"
              onClick={() => onNavigate("items")}
              className="border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#EADDC7]"
            >
              Ver Todos
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentItems.map((item) => (
              <CardItem
                key={item.id}
                {...item}
                onClick={() => onNavigate("item-details")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#5A3825] text-[#F8F3E7] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 Plataforma de Desapegos. Transformando vidas através da sustentabilidade.</p>
        </div>
      </footer>
    </div>
  );
}
