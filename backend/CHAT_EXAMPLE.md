# 💬 Exemplo de Uso do Chat Socket.IO

## Como testar o chat

### 1. No Frontend (JavaScript/React)

```javascript
import { io } from 'socket.io-client';

// Conectar ao servidor
const socket = io('http://localhost:4000');

// Escutar quando conectar
socket.on('connect', () => {
  console.log('Conectado ao servidor:', socket.id);
});

// Enviar mensagem
socket.emit('sendMessage', {
  userId: 1,
  userName: 'Beatriz',
  message: 'Olá! Tenho interesse neste item.',
  itemId: 1,
});

// Receber mensagens
socket.on('receiveMessage', (data) => {
  console.log('Nova mensagem:', data);
  // Atualizar UI com a mensagem
});

// Entrar em uma sala (chat de um item específico)
socket.emit('joinRoom', 'item-1');

// Indicar que está digitando
socket.emit('userTyping', {
  userId: 1,
  userName: 'Beatriz',
  itemId: 1,
});

// Parar de digitar
socket.emit('userStoppedTyping', {
  userId: 1,
  itemId: 1,
});

// Desconectar
socket.on('disconnect', () => {
  console.log('Desconectado do servidor');
});
```

### 2. Teste Online

Use o site: https://amritb.github.io/socketio-client-tool/

- **URL**: `http://localhost:4000`
- **Evento para enviar**: `sendMessage`
- **Evento para receber**: `receiveMessage`

### 3. Estrutura de Dados

**Enviar mensagem:**
```json
{
  "userId": 1,
  "userName": "Beatriz",
  "message": "Olá! Tenho interesse neste item.",
  "itemId": 1
}
```

**Receber mensagem:**
```json
{
  "userId": 1,
  "userName": "Beatriz",
  "message": "Olá! Tenho interesse neste item.",
  "itemId": 1,
  "socketId": "abc123",
  "timestamp": "2025-11-12T19:10:00.000Z"
}
```

## Eventos Disponíveis

- `sendMessage` - Enviar mensagem
- `receiveMessage` - Receber mensagem
- `joinRoom` - Entrar em uma sala (ex: chat de um item)
- `leaveRoom` - Sair de uma sala
- `userTyping` - Usuário está digitando
- `userStoppedTyping` - Usuário parou de digitar

