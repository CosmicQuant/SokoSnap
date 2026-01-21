import { Lead, Order, Product, SellerStats } from './types';

export const SHOP_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    sellerId: 'sell_1',
    sellerName: 'Eastleigh Kicks',
    sellerHandle: '@eastleigh_kicks',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eastleigh',
    verified: true,
    name: 'Air Jordan 1 Retro "University Blue"',
    price: 4500,
    currency: 'KES',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-sneakers-34537-large.mp4',
    description: 'Authentic quality. Available sizes 38-45. Same day delivery via TumaFast Black. 🔥👟',
    likes: '2.1k',
    comments: '142',
    isHighValue: false,
  },
  {
    id: 'prod_2',
    sellerId: 'sell_1',
    sellerName: 'Eastleigh Kicks',
    sellerHandle: '@eastleigh_kicks',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eastleigh',
    verified: true,
    name: 'Nike Tech Fleece - Grey Edition',
    price: 3800,
    currency: 'KES',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy cotton. Perfect for Nairobi weather. Order now before stock runs out!',
    likes: '850',
    comments: '34',
    isHighValue: false,
  }
];

export const TRENDING_PRODUCTS: Product[] = [
  {
    id: 'prod_3',
    sellerId: 'sell_2',
    sellerName: 'Scents & More',
    sellerHandle: '@scents_kenya',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scents',
    verified: true,
    name: 'Chanel No. 5 (100ml) - Sealed',
    price: 42000,
    currency: 'KES',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
    description: 'Original with batch code. Delivered sealed with TumaFast Holographic Tape. 💎',
    likes: '12.4k',
    comments: '890',
    isHighValue: true,
  },
  {
    id: 'prod_4',
    sellerId: 'sell_3',
    sellerName: 'TechWorld KE',
    sellerHandle: '@techworld_ke',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    verified: true,
    name: 'iPhone 15 Pro Max (Titanium)',
    price: 185000,
    currency: 'KES',
    type: 'video',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-at-night-42211-large.mp4',
    description: 'Brand new, US spec. Pay on delivery using TumaFast Secure Escrow.',
    likes: '45k',
    comments: '2.1k',
    isHighValue: true,
  }
];

export const SELLER_STATS: SellerStats = {
  totalSales: 142500,
  orders: 32,
  pendingPayout: 12400,
  views: 4800
};

export const RECENT_ORDERS: Order[] = [
  { id: 'ORD-8821', item: 'Jordan 1 Retro', amount: 4500, customer: '0722***890', status: 'In Transit', rider: 'Kamau' },
  { id: 'ORD-8820', item: 'Tech Fleece', amount: 3800, customer: '0711***412', status: 'Delivered', rider: 'Otieno' },
  { id: 'ORD-8819', item: 'Air Force 1', amount: 3500, customer: '0745***110', status: 'Delivered', rider: 'Sarah' },
];

export const LEADS: Lead[] = [
  { id: 'lead_1', platform: 'TikTok', handle: 'nairobisneakers_254', productHint: 'New stock J4s', frictionScore: 45, lastPostTime: '10 mins ago', status: 'New' },
  { id: 'lead_2', platform: 'Instagram', handle: 'luxury_watches_ke', productHint: 'Rolex Submariner', frictionScore: 12, lastPostTime: '1 hour ago', status: 'New' },
  { id: 'lead_3', platform: 'TikTok', handle: 'thrift_queen', productHint: 'Denim Jackets', frictionScore: 82, lastPostTime: '2 hours ago', status: 'Contacted' },
];
