/**
 * Tela de Chat
 * Design conforme Figma
 */

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "../../layout/AppLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ArrowLeft, Send, User } from "lucide-react";
import { toast } from "sonner";
import { useChat } from "../../hooks/useChat";
import { itemService, Item } from "../../services/itemService";
import { useAuth } from "../../hooks/useAuth";

export function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const itemId = id ? parseInt(id) : 0;

  const { messages, isConnected, sendMessage } = useChat({
    itemId,
    onNewMessage: () => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        navigate("/home");
        return;
      }

      try {
        setLoading(true);
        const itemId = parseInt(id);
        if (isNaN(itemId)) {
          toast.error("ID de item inválido");
          navigate("/home");
          return;
        }

        const fetchedItem = await itemService.getItemById(itemId);
        setItem(fetchedItem);
      } catch (error: any) {
        toast.error("Erro ao carregar item: " + (error.message || "Item não encontrado"));
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id, navigate]);

  useEffect(() => {
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
      setNewMessage(messageText);
    }
  };

  if (loading || !item) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando chat...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={() => navigate(`/item/${id}`)}
            variant="outline"
            className="border-primary-300 text-foreground hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-foreground text-2xl font-bold">Chat sobre o item</h1>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground">{item.title}</p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-card rounded-2xl border-2 border-border shadow-medium overflow-hidden flex flex-col h-[calc(100vh-200px)]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma mensagem ainda. Seja o primeiro a enviar!
                </p>
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
                          ? "bg-primary-400 text-primary-50 rounded-br-sm"
                          : "bg-card text-foreground border-2 border-border rounded-bl-sm"
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
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t-2 border-border bg-card"
          >
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 border-primary-300 text-foreground placeholder:text-muted-foreground focus:border-primary-400 focus:ring-primary-400"
                disabled={!isConnected}
              />
              <Button
                type="submit"
                disabled={!isConnected || !newMessage.trim()}
                className="bg-primary-400 hover:bg-primary-500 text-primary-50 px-6 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

