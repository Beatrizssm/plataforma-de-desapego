import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Send, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useChat } from "../hooks/useChat";
import { itemService, Item } from "../services/itemService";
import { useAuth } from "../hooks/useAuth";


export function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const itemId = id ? parseInt(id) : 0;

  const { messages, isConnected, sendMessage } = useChat({
    itemId,
    onNewMessage: () => {
      // Scroll para a última mensagem quando nova mensagem chega
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  // Carregar item do backend
  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        navigate("/items");
        return;
      }

      try {
        setLoading(true);
        const itemId = parseInt(id);
        if (isNaN(itemId)) {
          toast.error("ID de item inválido");
          navigate("/items");
          return;
        }

        const fetchedItem = await itemService.getItemById(itemId);
        setItem(fetchedItem);
      } catch (error: any) {
        toast.error("Erro ao carregar item: " + (error.message || "Item não encontrado"));
        navigate("/items");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, navigate]);

  useEffect(() => {
    // Scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !item) {
      return;
    }

    if (!isConnected) {
      toast.error("Não conectado ao servidor. Aguarde...");
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage("");

    const success = sendMessage(messageText);
    if (!success) {
      setNewMessage(messageText); // Restaurar mensagem se falhar
    }
  };

  if (loading || !item) {
    return (
      <div className="min-h-screen bg-[#F8F3E7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A3825] mx-auto mb-4"></div>
          <p className="text-[#8B5E3C]">Carregando chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3E7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={() => navigate(`/item/${id}`)}
            variant="outline"
            className="border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#EADDC7]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[#3A2B1D] text-2xl font-bold">Chat sobre o item</h1>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-[#8B5E3C]">
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <p className="text-[#8B5E3C]">{item.title}</p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl border-2 border-[#C9A77A] shadow-lg overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8F3E7]">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#8B5E3C]">Nenhuma mensagem ainda. Seja o primeiro a enviar!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.userId === user?.id;
                const messageDate = new Date(message.timestamp);
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isOwnMessage
                          ? "bg-[#5A3825] text-[#F8F3E7] rounded-br-sm"
                          : "bg-white text-[#3A2B1D] border-2 border-[#C9A77A] rounded-bl-sm"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4" />
                        <span className="text-xs font-semibold">
                          {isOwnMessage ? user?.name || "Você" : item.owner?.name || "Doador"}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {messageDate.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-[#C9A77A] bg-white">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border-[#C9A77A] focus:border-[#8B5E3C]"
              />
              <Button
                type="submit"
                className="bg-[#5A3825] hover:bg-[#3A2B1D] text-[#F8F3E7] px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

