import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed with authentic creator data...');

  // Clean existing tables
  await prisma.dailyStats.deleteMany({});
  await prisma.reel.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Creator A: Alina Vance
  const userA = await prisma.user.create({
    data: {
      id: 'usr_alina_vance_01',
      name: 'Alina Vance',
      username: 'alina_vance',
      email: 'alina@creator.ai',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      instagramUsername: 'alina.creates',
    },
  });

  // 2. Creator B: Marcus Chen
  const userB = await prisma.user.create({
    data: {
      id: 'usr_marcus_chen_02',
      name: 'Marcus Chen',
      username: 'marcus_tech',
      email: 'marcus@creator.ai',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      instagramUsername: 'marcus.visuals',
    },
  });

  // 3. Creator C: Elena Rostova
  const userC = await prisma.user.create({
    data: {
      id: 'usr_elena_rostova_03',
      name: 'Elena Rostova',
      username: 'elena_lifestyle',
      email: 'elena@creator.ai',
      passwordHash,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      instagramUsername: 'elena.rostova',
    },
  });

  const createHistoricalStats = (reelId: string, baseViews: number, baseLikes: number, baseComments: number, baseShares: number, daysAgo: number = 30) => {
    const stats = [];
    const now = new Date();
    
    for (let i = daysAgo; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const progress = (daysAgo - i) / daysAgo;
      const factor = Math.sin(progress * Math.PI * 0.8) * 0.4 + progress * 0.8 + 0.2;
      const noise = (Math.sin(i * 3.7) + 1) * 0.15;
      
      const views = Math.floor((baseViews / daysAgo) * (factor + noise) * 1.2);
      const likes = Math.floor((baseLikes / daysAgo) * (factor + noise) * 1.1);
      const comments = Math.floor((baseComments / daysAgo) * (factor + noise));
      const shares = Math.floor((baseShares / daysAgo) * (factor + noise));

      stats.push({
        reelId,
        date,
        views: Math.max(15, views),
        likes: Math.max(2, likes),
        comments: Math.max(0, comments),
        shares: Math.max(0, shares),
      });
    }
    return stats;
  };

  // Seed Reels for Alina Vance (Creator A)
  const reelsAData = [
    {
      id: 'reel_a_01',
      userId: userA.id,
      instagramUrl: 'https://www.instagram.com/reel/C8x9L2pM4Ka/',
      instagramId: 'C8x9L2pM4Ka',
      title: 'Утро без спешки',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 2 * 86400000),
      views: 92400,
      likes: 8710,
      comments: 612,
      shares: 1240,
    },
    {
      id: 'reel_a_02',
      userId: userA.id,
      instagramUrl: 'https://www.instagram.com/reel/C7a3K9vL1Qz/',
      instagramId: 'C7a3K9vL1Qz',
      title: 'Тишина океана',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 4 * 86400000),
      views: 64100,
      likes: 5430,
      comments: 380,
      shares: 720,
    },
    {
      id: 'reel_a_03',
      userId: userA.id,
      instagramUrl: 'https://www.instagram.com/reel/C6m8P4kR2Wb/',
      instagramId: 'C6m8P4kR2Wb',
      title: 'Грань тепла',
      thumbnailUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 6 * 86400000),
      views: 51200,
      likes: 4200,
      comments: 290,
      shares: 510,
    },
    {
      id: 'reel_a_04',
      userId: userA.id,
      instagramUrl: 'https://www.instagram.com/reel/C5j2N7tY8Xc/',
      instagramId: 'C5j2N7tY8Xc',
      title: 'День рождения',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 9 * 86400000),
      views: 43800,
      likes: 3800,
      comments: 240,
      shares: 480,
    },
    {
      id: 'reel_a_05',
      userId: userA.id,
      instagramUrl: 'https://www.instagram.com/reel/C4h1V5wE9Za/',
      instagramId: 'C4h1V5wE9Za',
      title: 'Всегда рядом',
      thumbnailUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 12 * 86400000),
      views: 38600,
      likes: 3100,
      comments: 195,
      shares: 340,
    },
    {
      id: 'reel_a_06',
      userId: userA.id,
      instagramUrl: 'https://www.instagram.com/reel/C3f9Q2bT4Vu/',
      instagramId: 'C3f9Q2bT4Vu',
      title: 'Портрет доверия',
      thumbnailUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 15 * 86400000),
      views: 29400,
      likes: 2450,
      comments: 160,
      shares: 280,
    },
  ];

  for (const reel of reelsAData) {
    const created = await prisma.reel.create({ data: reel });
    const stats = createHistoricalStats(created.id, reel.views, reel.likes, reel.comments, reel.shares, 30);
    await prisma.dailyStats.createMany({ data: stats });
  }

  // Seed Reels for Marcus Chen (Creator B)
  const reelsBData = [
    {
      id: 'reel_b_01',
      userId: userB.id,
      instagramUrl: 'https://www.instagram.com/reel/C9b8M1qW3Ex/',
      instagramId: 'C9b8M1qW3Ex',
      title: '3 идеи для съёмки',
      thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 3 * 86400000),
      views: 78500,
      likes: 7120,
      comments: 540,
      shares: 980,
    },
    {
      id: 'reel_b_02',
      userId: userB.id,
      instagramUrl: 'https://www.instagram.com/reel/C8a4J6yP9Lz/',
      instagramId: 'C8a4J6yP9Lz',
      title: 'Мой рабочий день',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 7 * 86400000),
      views: 52400,
      likes: 4600,
      comments: 310,
      shares: 620,
    },
  ];

  for (const reel of reelsBData) {
    const created = await prisma.reel.create({ data: reel });
    const stats = createHistoricalStats(created.id, reel.views, reel.likes, reel.comments, reel.shares, 30);
    await prisma.dailyStats.createMany({ data: stats });
  }

  // Seed Reels for Elena Rostova (Creator C)
  const reelsCData = [
    {
      id: 'reel_c_01',
      userId: userC.id,
      instagramUrl: 'https://www.instagram.com/reel/C9c7V2bR4Za/',
      instagramId: 'C9c7V2bR4Za',
      title: 'Праздничный торт',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 1 * 86400000),
      views: 84200,
      likes: 7900,
      comments: 580,
      shares: 1100,
    },
    {
      id: 'reel_c_02',
      userId: userC.id,
      instagramUrl: 'https://www.instagram.com/reel/C8x1N5tY3Qp/',
      instagramId: 'C8x1N5tY3Qp',
      title: 'Что изменилось за год',
      thumbnailUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
      publishedAt: new Date(Date.now() - 5 * 86400000),
      views: 49300,
      likes: 4100,
      comments: 290,
      shares: 490,
    },
  ];

  for (const reel of reelsCData) {
    const created = await prisma.reel.create({ data: reel });
    const stats = createHistoricalStats(created.id, reel.views, reel.likes, reel.comments, reel.shares, 30);
    await prisma.dailyStats.createMany({ data: stats });
  }

  console.log('✅ Seed completed successfully with lifestyle creator content!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
