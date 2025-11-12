import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Send, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

// Lista de itens fixos (mesma lista do ItemDetailsPage)
const fixedItems = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1626477357166-ed26f0e3f1cc",
    title: "Camisetas Variadas",
    description: "Lote de camisetas em ótimo estado, diversas cores e tamanhos.",
    status: "available" as const,
    category: "Roupas",
    location: "São Paulo, SP",
    postedDate: "10 de Janeiro, 2025",
    donor: {
      name: "João Silva",
      email: "joao.silva@email.com",
    },
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1654360057953-81305834dd30",
    title: "Laptop Dell Inspiron",
    description: "Laptop Dell i5, 8GB RAM, funcionando perfeitamente.",
    status: "reserved" as const,
    category: "Eletrônicos",
    location: "Rio de Janeiro, RJ",
    postedDate: "08 de Janeiro, 2025",
    donor: {
      name: "Ana Costa",
      email: "ana.costa@email.com",
    },
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1702018706865-e5306a8fa007",
    title: "Cadeira de Madeira Artesanal",
    description: "Linda cadeira de madeira maciça, feita artesanalmente.",
    status: "available" as const,
    category: "Móveis",
    location: "São Paulo, SP",
    postedDate: "05 de Outubro, 2024",
    donor: {
      name: "Maria Silva",
      email: "maria.silva@email.com",
    },
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1680537250732-6835b59c937e",
    title: "Coleção de Livros Clássicos",
    description: "Diversos livros de literatura clássica brasileira e mundial.",
    status: "donated" as const,
    category: "Livros",
    location: "Belo Horizonte, MG",
    postedDate: "15 de Dezembro, 2024",
    donor: {
      name: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
    },
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1733809701005-0b1c0ad53c90",
    title: "Itens de Decoração",
    description: "Vários itens de decoração vintage para sua casa.",
    status: "available" as const,
    category: "Outros",
    location: "Curitiba, PR",
    postedDate: "20 de Janeiro, 2025",
    donor: {
      name: "Patricia Santos",
      email: "patricia.santos@email.com",
    },
  },
  {
    id: "6",
    image: "https://images.unsplash.com/photo-1662070027900-7844087ea06d",
    title: "Almofadas e Mantas",
    description: "Conjunto de almofadas e mantas confortáveis para decorar sua casa.",
    status: "available" as const,
    category: "Outros",
    location: "Porto Alegre, RS",
    postedDate: "12 de Janeiro, 2025",
    donor: {
      name: "Roberto Lima",
      email: "roberto.lima@email.com",
    },
  },
];

interface Message {
  id: string;
  text: string;
  sender: "user" | "donor";
  timestamp: Date;
}

export function ChatPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const currentUser = localStorage.getItem("currentUser") || "Você";

  useEffect(() => {
    if (!id) {
      navigate("/items");
      return;
    }

    // Inicializar Socket.IO
    const socket = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    // Eventos do Socket.IO
    socket.on("connect", () => {
      console.log("🟢 Conectado ao chat:", socket.id);
      setIsConnected(true);
      
      // Entrar na sala do item
      socket.emit("joinRoom", `item-${id}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Desconectado do chat");
      setIsConnected(false);
    });

    // Escutar notificações para o usuário logado
    const userId = parseInt(localStorage.getItem("userId") || "0");
    if (userId) {
      socket.on(`notify:${userId}`, (notification: any) => {
        console.log("🔔 Notificação recebida:", notification);
        
        // Mostrar notificação usando toast
        if (notification.type === "new_message") {
          toast.success(`${notification.title} - ${notification.body}`, {
            duration: 5000,
            action: {
              label: "Ver",
              onClick: () => {
                if (notification.itemId && notification.itemId.toString() !== id) {
                  navigate(`/chat/${notification.itemId}`);
                }
              },
            },
          });
        }
      });
    }

    // Receber mensagens em tempo real
    socket.on("receiveMessage", (data: any) => {
      console.log("💬 Nova mensagem recebida:", data);
      
      // Verificar se é mensagem do sistema ou mensagem normal
      if (data.type === "system") {
        // Mensagem do sistema (ex: usuário entrou)
        return;
      }

      const currentUserId = parseInt(localStorage.getItem("userId") || "0");
      const isOwnMessage = data.userId === currentUserId;

      // Criar ID único baseado no ID do banco (se existir) ou timestamp + socketId
      const timestamp = data.timestamp || new Date().toISOString();
      const socketId = data.socketId || socketRef.current?.id || "unknown";
      const messageId = data.id ? `db-${data.id}` : `${timestamp}-${socketId}-${data.userId || 0}`;

      const newMsg: Message = {
        id: messageId,
        text: data.message || data.text || "",
        sender: isOwnMessage ? "user" : "donor",
        timestamp: new Date(timestamp),
      };

      // Verificar se a mensagem já existe antes de adicionar (evitar duplicatas)
      setMessages((prev) => {
        // Verificar duplicatas por ID ou por conteúdo + timestamp similar
        const exists = prev.some((msg) => {
          return msg.id === messageId || 
                 (msg.text === newMsg.text && 
                  Math.abs(msg.timestamp.getTime() - newMsg.timestamp.getTime()) < 1000);
        });
        
        if (exists) {
          console.log("⚠️ Mensagem duplicada ignorada:", messageId);
          return prev; // Não adicionar se já existe
        }
        
        const updated = [...prev, newMsg];
        
        // Salvar no localStorage como histórico
        const chatKey = `chat_${id}`;
        try {
          localStorage.setItem(chatKey, JSON.stringify(updated.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString(),
          }))));
        } catch (error) {
          console.error("Erro ao salvar no localStorage:", error);
        }
        
        return updated;
      });
    });

    // Busca o item
    let foundItem = fixedItems.find(item => item.id === id);
    if (!foundItem) {
      const myItems = JSON.parse(localStorage.getItem("myItems") || "[]");
      foundItem = myItems.find((item: any) => item.id === id);
      
      if (foundItem) {
        foundItem = {
          ...foundItem,
          location: foundItem.location || "Não informado",
          postedDate: foundItem.postedDate || new Date().toLocaleDateString("pt-BR"),
          donor: foundItem.donor || {
            name: "Usuário",
            email: "usuario@email.com",
          },
        };
      }
    }

    if (foundItem) {
      setItem(foundItem);
      
      // Carregar histórico de mensagens do banco de dados
      const loadMessages = async () => {
        try {
          const token = localStorage.getItem("token");
          const headers: HeadersInit = {
            "Content-Type": "application/json",
          };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const response = await fetch(`http://localhost:4000/api/chat/${id}`, {
            headers,
          });
          if (response.ok) {
            const dbMessages = await response.json();
            const formattedMessages: Message[] = dbMessages.map((msg: any) => ({
              id: `db-${msg.id}`,
              text: msg.text,
              sender: msg.userId === parseInt(localStorage.getItem("userId") || "0") ? "user" : "donor",
              timestamp: new Date(msg.timestamp),
            }));
            setMessages(formattedMessages);
            
            // Salvar no localStorage como backup
            const chatKey = `chat_${id}`;
            localStorage.setItem(chatKey, JSON.stringify(formattedMessages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp.toISOString(),
            }))));
          } else {
            // Fallback para localStorage se a API falhar
            const chatKey = `chat_${id}`;
            const savedMessages = JSON.parse(localStorage.getItem(chatKey) || "[]");
            if (savedMessages.length > 0) {
              setMessages(savedMessages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })));
            }
          }
        } catch (error) {
          console.error("Erro ao carregar mensagens:", error);
          // Fallback para localStorage
          const chatKey = `chat_${id}`;
          const savedMessages = JSON.parse(localStorage.getItem(chatKey) || "[]");
          if (savedMessages.length > 0) {
            setMessages(savedMessages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })));
          }
        }
      };
      
      loadMessages();
    } else {
      toast.error("Item não encontrado");
      navigate("/items");
    }

    // Cleanup
    return () => {
      if (socketRef.current) {
        const userId = parseInt(localStorage.getItem("userId") || "0");
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("receiveMessage");
        if (userId) {
          socketRef.current.off(`notify:${userId}`);
        }
        socketRef.current.emit("leaveRoom", `item-${id}`);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    // Scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !item || !socketRef.current || !socketRef.current.connected) {
      if (!socketRef.current?.connected) {
        toast.error("Não conectado ao servidor. Aguarde...");
      }
      return;
    }

    const userId = parseInt(localStorage.getItem("userId") || "0");
    const userName = localStorage.getItem("currentUser") || "Usuário";
    const messageText = newMessage.trim();

    // Limpar input imediatamente
    setNewMessage("");

    // Enviar mensagem via Socket.IO (a mensagem será adicionada quando receber do servidor)
    socketRef.current.emit("sendMessage", {
      userId,
      userName,
      message: messageText,
      text: messageText,
      itemId: parseInt(id || "0"),
    });

    // Salvar no localStorage após receber do servidor (será atualizado no evento receiveMessage)
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F8F3E7] flex items-center justify-center">
        <p className="text-[#8B5E3C]">Carregando...</p>
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-[#5A3825] text-[#F8F3E7] rounded-br-sm"
                      : "bg-white text-[#3A2B1D] border-2 border-[#C9A77A] rounded-bl-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-xs font-semibold">
                      {message.sender === "user" ? currentUser : item.donor?.name || "Doador"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
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

