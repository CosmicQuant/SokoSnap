export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerHandle: string;
  sellerAvatar: string;
  verified: boolean;
  name: string;
  price: number;
  currency: string;
  type: 'video' | 'image';
  mediaUrl: string;
  description: string;
  likes: string;
  comments: string;
  isHighValue?: boolean; // Triggers TumaFast Black
}

export interface SellerStats {
  totalSales: number;
  orders: number;
  pendingPayout: number;
  views: number;
}

export interface Lead {
  id: string;
  platform: 'TikTok' | 'Instagram';
  handle: string;
  productHint: string;
  frictionScore: number; // How many people asked "Price?"
  lastPostTime: string;
  status: 'New' | 'Contacted' | 'Onboarded';
}

export interface Order {
  id: string;
  item: string;
  amount: number;
  customer: string;
  status: 'Processing' | 'In Transit' | 'Delivered';
  rider?: string;
}
