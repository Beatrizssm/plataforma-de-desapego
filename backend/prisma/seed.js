import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (opcional - comente se não quiser limpar)
  console.log('🧹 Limpando dados existentes...');
  await prisma.message.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('👥 Criando usuários...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@example.com',
      password: hashedPassword,
      profile: 'user',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@example.com',
      password: hashedPassword,
      profile: 'user',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      profile: 'admin',
    },
  });

  console.log(`✅ Usuários criados: ${user1.name}, ${user2.name}, ${admin.name}`);

  // Criar itens
  console.log('📦 Criando itens...');

  const item1 = await prisma.item.create({
    data: {
      title: 'Notebook Dell Inspiron',
      description: 'Notebook Dell Inspiron 15, 8GB RAM, 256GB SSD, processador Intel i5. Em ótimo estado, pouco uso.',
      price: 2500.00,
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      ownerId: user1.id,
    },
  });

  const item2 = await prisma.item.create({
    data: {
      title: 'Guitarra Fender Stratocaster',
      description: 'Guitarra elétrica Fender Stratocaster, cor sunburst. Inclui case e cabo. Excelente para iniciantes.',
      price: 1800.00,
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
      ownerId: user2.id,
    },
  });

  const item3 = await prisma.item.create({
    data: {
      title: 'Bicicleta Caloi Aro 26',
      description: 'Bicicleta Caloi aro 26, 21 marchas, freio a disco. Revisada recentemente, pronta para uso.',
      price: 450.00,
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      ownerId: user1.id,
    },
  });

  const item4 = await prisma.item.create({
    data: {
      title: 'Mesa de Escritório',
      description: 'Mesa de escritório em MDF, 120x60cm, com gavetas. Perfeita para home office.',
      price: 350.00,
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      ownerId: user2.id,
    },
  });

  const item5 = await prisma.item.create({
    data: {
      title: 'iPhone 12 Pro',
      description: 'iPhone 12 Pro 128GB, cor azul. Tela sem riscos, bateria em ótimo estado. Inclui carregador e capa.',
      price: 3200.00,
      available: true,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      ownerId: admin.id,
    },
  });

  console.log(`✅ Itens criados: ${item1.title}, ${item2.title}, ${item3.title}, ${item4.title}, ${item5.title}`);

  // Criar algumas mensagens
  console.log('💬 Criando mensagens...');

  await prisma.message.create({
    data: {
      text: 'Olá! Tenho interesse neste item. Ainda está disponível?',
      userId: user2.id,
      itemId: item1.id,
    },
  });

  await prisma.message.create({
    data: {
      text: 'Sim, ainda está disponível! Podemos combinar a entrega.',
      userId: user1.id,
      itemId: item1.id,
    },
  });

  await prisma.message.create({
    data: {
      text: 'Qual o valor mínimo que você aceita?',
      userId: user1.id,
      itemId: item2.id,
    },
  });

  console.log('✅ Mensagens criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📝 Credenciais de teste:');
  console.log('   Email: joao@example.com | Senha: 123456');
  console.log('   Email: maria@example.com | Senha: 123456');
  console.log('   Email: admin@example.com | Senha: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

