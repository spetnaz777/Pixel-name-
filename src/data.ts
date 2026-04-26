export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Mugs' | 'T-Shirts' | 'Accessories';
  image: string;
  hoverImage?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  {
    id: 'm1',
    name: 'Dragon Serpent Mug',
    description: 'A matte black ceramic mug with custom pixelated dragon artwork.',
    price: 24,
    category: 'Mugs',
    image: 'https://cdn.pixabay.com/photo/2021/04/10/22/01/sword-6168172_1280.png', // Sword as placeholder for pixel look
    isBestSeller: true
  },
  {
    id: 't1',
    name: 'Glitch Guardian Tee',
    description: '100% Cotton tee featuring the legendary Pixle Man in armor.',
    price: 32,
    category: 'T-Shirts',
    image: 'https://cdn.pixabay.com/photo/2012/04/14/13/28/wizard-33902_1280.png', 
    isNew: true
  },
  {
    id: 'a1',
    name: '8-Bit Treasure Bag',
    description: 'A durable drawstring bag with reflective pixel patterns.',
    price: 18,
    category: 'Accessories',
    image: 'https://cdn.pixabay.com/photo/2024/02/10/01/16/dragon-8563964_1280.png', 
    isBestSeller: true
  },
  {
    id: 'm2',
    name: 'Quest Log Tumbler',
    description: 'Keep your potions cold for 24 hours in this insulated tumbler.',
    price: 28,
    category: 'Mugs',
    image: 'https://cdn.pixabay.com/photo/2014/12/21/23/34/flask-575691_1280.png',
    isNew: true
  },
  {
    id: 't2',
    name: 'CRT Static Hoodie',
    description: 'Heavyweight hoodie with retro monitor scanline effects.',
    price: 55,
    category: 'T-Shirts',
    image: 'https://cdn.pixabay.com/photo/2021/04/10/22/01/sword-6168172_1280.png'
  },
  {
    id: 'a2',
    name: 'Pixel Heart Keychain',
    description: 'Gain +1 Max HP in real life with this acrylic charm.',
    price: 8,
    category: 'Accessories',
    image: 'https://cdn.pixabay.com/photo/2024/02/10/01/16/dragon-8563964_1280.png'
  }
];
