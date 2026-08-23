export interface InstagramReelData {
  instagramId: string;
  instagramUrl: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface InstagramProvider {
  getReelData(url: string): Promise<InstagramReelData>;
  validateUrl(url: string): boolean;
}

export class MockInstagramProvider implements InstagramProvider {
  private sampleTitles = [
    'Утро без спешки',
    'Тишина океана',
    'Мой рабочий день',
    'Что изменилось за год',
    '3 идеи для съёмки',
    'День рождения',
    'Портрет доверия',
    'Грань тепла',
    'Всегда рядом',
    'Праздничный торт',
    'Летний вечер',
    'Детали стиля',
  ];

  private sampleThumbnails = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
  ];

  public validateUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    const regex = /^(https?:\/\/)?(www\.)?instagram\.com\/(reel|reels|p)\/([A-Za-z0-9_-]+)/i;
    return regex.test(url.trim());
  }

  public extractReelId(url: string): string {
    const match = url.match(/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
    if (match && match[1]) {
      return match[1];
    }
    return `reel_${Math.random().toString(36).substring(2, 9)}`;
  }

  public async getReelData(url: string): Promise<InstagramReelData> {
    if (!this.validateUrl(url)) {
      throw new Error('Invalid Instagram Reel URL format. Must be e.g. https://www.instagram.com/reel/C8x9L2pM4Ka/');
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    const instagramId = this.extractReelId(url);

    let hash = 0;
    for (let i = 0; i < instagramId.length; i++) {
      hash = (hash << 5) - hash + instagramId.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const titleIndex = absHash % this.sampleTitles.length;
    const thumbIndex = absHash % this.sampleThumbnails.length;

    const views = 18000 + (absHash % 85000);
    const likes = Math.floor(views * (0.08 + (absHash % 5) / 100));
    const comments = Math.floor(likes * (0.05 + (absHash % 3) / 100));
    const shares = Math.floor(likes * (0.12 + (absHash % 6) / 100));

    const daysAgo = 1 + (absHash % 14);
    const publishedAt = new Date(Date.now() - daysAgo * 86400000);

    return {
      instagramId,
      instagramUrl: url.trim(),
      title: this.sampleTitles[titleIndex],
      thumbnailUrl: this.sampleThumbnails[thumbIndex],
      publishedAt,
      views,
      likes,
      comments,
      shares,
    };
  }
}

export const defaultInstagramProvider: InstagramProvider = new MockInstagramProvider();
