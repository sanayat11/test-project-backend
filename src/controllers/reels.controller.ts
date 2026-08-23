import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';
import { defaultInstagramProvider } from '../providers/instagram.provider';

export const getReels = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;

    const { search, sort = 'newest' } = req.query;

    const whereClause: any = { userId };

    if (search && typeof search === 'string' && search.trim()) {
      whereClause.title = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    let orderBy: any = { publishedAt: 'desc' };
    if (sort === 'views') {
      orderBy = { views: 'desc' };
    } else if (sort === 'likes') {
      orderBy = { likes: 'desc' };
    } else if (sort === 'engagement') {
      orderBy = { views: 'desc' };
    }

    const reels = await prisma.reel.findMany({
      where: whereClause,
      orderBy,
      include: {
        dailyStats: {
          take: 7,
          orderBy: { date: 'desc' },
        },
      },
    });

    // Compute calculated fields (e.g. engagement rate = (likes + comments + shares) / views * 100)
    let formattedReels = reels.map((reel) => {
      const totalEngagements = reel.likes + reel.comments + reel.shares;
      const engagementRate = reel.views > 0 ? parseFloat(((totalEngagements / reel.views) * 100).toFixed(2)) : 0;
      return {
        ...reel,
        engagementRate,
      };
    });

    // If sorting by engagement, sort in-memory
    if (sort === 'engagement') {
      formattedReels.sort((a, b) => b.engagementRate - a.engagementRate);
    }

    return res.status(200).json({ reels: formattedReels });
  } catch (error: any) {
    console.error('Error fetching reels:', error);
    return res.status(500).json({ message: 'Failed to fetch reels', error: error.message });
  }
};

export const getReelById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;
    const { id } = req.params;

    const reel = await prisma.reel.findFirst({
      where: {
        id,
        userId, // Strict scoping
      },
      include: {
        dailyStats: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!reel) {
      return res.status(404).json({ message: 'Reel not found or unauthorized access.' });
    }

    const totalEngagements = reel.likes + reel.comments + reel.shares;
    const engagementRate = reel.views > 0 ? parseFloat(((totalEngagements / reel.views) * 100).toFixed(2)) : 0;

    return res.status(200).json({
      reel: {
        ...reel,
        engagementRate,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch reel details', error: error.message });
  }
};

export const syncReel = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;
    const { instagramUrl } = req.body;

    if (!instagramUrl) {
      return res.status(400).json({ message: 'Instagram Reel URL is required.' });
    }

    if (!defaultInstagramProvider.validateUrl(instagramUrl)) {
      return res.status(400).json({
        message: 'Invalid Instagram URL format. Please provide a valid link like https://www.instagram.com/reel/C8x9L2pM4Ka/',
      });
    }

    // Call Provider Abstraction
    const reelData = await defaultInstagramProvider.getReelData(instagramUrl);

    // Save to Database associated with current user
    const newReel = await prisma.reel.create({
      data: {
        userId,
        instagramUrl: reelData.instagramUrl,
        instagramId: reelData.instagramId,
        title: reelData.title,
        thumbnailUrl: reelData.thumbnailUrl,
        publishedAt: reelData.publishedAt,
        views: reelData.views,
        likes: reelData.likes,
        comments: reelData.comments,
        shares: reelData.shares,
      },
    });

    // Create initial 14-day daily stats trend
    const stats = [];
    const now = new Date();
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const factor = (15 - i) / 15;
      stats.push({
        reelId: newReel.id,
        date,
        views: Math.floor((reelData.views / 14) * (0.4 + factor * 0.8)),
        likes: Math.floor((reelData.likes / 14) * (0.4 + factor * 0.8)),
        comments: Math.floor((reelData.comments / 14) * (0.4 + factor * 0.8)),
        shares: Math.floor((reelData.shares / 14) * (0.4 + factor * 0.8)),
      });
    }
    await prisma.dailyStats.createMany({ data: stats });

    const totalEngagements = newReel.likes + newReel.comments + newReel.shares;
    const engagementRate = newReel.views > 0 ? parseFloat(((totalEngagements / newReel.views) * 100).toFixed(2)) : 0;

    return res.status(201).json({
      message: 'Reel synchronized successfully!',
      reel: {
        ...newReel,
        engagementRate,
      },
    });
  } catch (error: any) {
    console.error('Error syncing reel:', error);
    return res.status(500).json({ message: error.message || 'Failed to synchronize Instagram Reel.' });
  }
};

export const deleteReel = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;
    const { id } = req.params;

    const existingReel = await prisma.reel.findFirst({
      where: { id, userId },
    });

    if (!existingReel) {
      return res.status(404).json({ message: 'Reel not found or access denied.' });
    }

    await prisma.reel.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Reel successfully deleted.' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete reel.', error: error.message });
  }
};
