import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        instagramUsername: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    const reelAggregate = await prisma.reel.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { views: true, likes: true },
    });

    return res.status(200).json({
      profile: {
        ...user,
        totalReels: reelAggregate._count.id || 0,
        totalViews: reelAggregate._sum.views || 0,
        totalLikes: reelAggregate._sum.likes || 0,
        instagramConnected: true, // Connected status
        lastSyncedAt: new Date(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;

    const { name, instagramUsername, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(instagramUsername && { instagramUsername }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        instagramUsername: true,
      },
    });

    return res.status(200).json({
      message: 'Profile successfully updated.',
      profile: updatedUser,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

export const syncInstagramAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userId = req.user.id;

    // Simulate Instagram graph API synchronization
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return res.status(200).json({
      message: 'Instagram account metadata synchronized successfully!',
      status: 'active',
      lastSyncTime: new Date(),
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to sync Instagram account', error: error.message });
  }
};
