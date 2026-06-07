import { Request, Response } from 'express';
import prisma from '../prisma';

// -----------------------------------------------
// SEPETİ GETİR
// GET /api/cart
// -----------------------------------------------
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true, // Ürün bilgilerini de getir
      },
    });

    // Toplam fiyatı hesapla
    const total = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    return res.status(200).json({ cartItems, total });

  } catch (error) {
    console.error('getCart hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// SEPETE ÜRÜN EKLE
// POST /api/cart
// Body: { productId, quantity }
// -----------------------------------------------
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Ürün ID zorunludur' });
    }

    // Ürün var mı ve stokta mı kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Yeterli stok yok' });
    }

    // Ürün zaten sepette var mı?
    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existingItem) {
      // Varsa miktarı artır
      const updated = await prisma.cartItem.update({
        where: { userId_productId: { userId, productId } },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
      return res.status(200).json({ message: 'Sepet güncellendi', cartItem: updated });
    }

    // Yoksa yeni ekle
    const cartItem = await prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true },
    });

    return res.status(201).json({ message: 'Ürün sepete eklendi', cartItem });

  } catch (error) {
    console.error('addToCart hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// SEPET ÜRÜN MİKTARINI GÜNCELLE
// PUT /api/cart/:productId
// Body: { quantity }
// -----------------------------------------------
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Miktar en az 1 olmalı' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity },
      include: { product: true },
    });

    return res.status(200).json({ message: 'Güncellendi', cartItem });

  } catch (error) {
    console.error('updateCartItem hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// SEPETTEN ÜRÜN KALDIR
// DELETE /api/cart/:productId
// -----------------------------------------------
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.params;

    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });

    return res.status(200).json({ message: 'Ürün sepetten kaldırıldı' });

  } catch (error) {
    console.error('removeFromCart hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// SEPETİ TAMAMEN TEMİZLE
// DELETE /api/cart
// -----------------------------------------------
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    await prisma.cartItem.deleteMany({ where: { userId } });

    return res.status(200).json({ message: 'Sepet temizlendi' });

  } catch (error) {
    console.error('clearCart hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};