import { Request, Response } from 'express';
import prisma from '../prisma';

// -----------------------------------------------
// TÜM ÜRÜNLERİ LİSTELE
// GET /api/products
// Query params: ?category=elektronik&search=telefon
// -----------------------------------------------
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    // Filtreleme koşulları
    // Kullanıcı kategori veya arama yaparsa filtrele, yapmazsa hepsini getir
    const where: any = {};

    if (category) {
      where.category = category as string;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }, // En yeni ürünler önce
    });

    return res.status(200).json({ products });

  } catch (error) {
    console.error('getProducts hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// TEK ÜRÜN GETİR
// GET /api/products/:id
// -----------------------------------------------
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    return res.status(200).json({ product });

  } catch (error) {
    console.error('getProduct hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// ÜRÜN EKLE (sadece admin)
// POST /api/products
// Body: { name, description, price, stock, image, category }
// -----------------------------------------------
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, image, category } = req.body;

    // Zorunlu alanları kontrol et
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Ad, açıklama, fiyat ve kategori zorunludur' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),   // String gelebilir, number'a çevir
        stock: parseInt(stock) || 0,
        image,
        category,
      }
    });

    return res.status(201).json({
      message: 'Ürün oluşturuldu',
      product,
    });

  } catch (error) {
    console.error('createProduct hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// ÜRÜN GÜNCELLE (sadece admin)
// PUT /api/products/:id
// -----------------------------------------------
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image, category } = req.body;

    // Ürün var mı?
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        // Sadece gönderilen alanları güncelle
        // undefined gönderilirse o alan değişmez
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(image && { image }),
        ...(category && { category }),
      }
    });

    return res.status(200).json({
      message: 'Ürün güncellendi',
      product,
    });

  } catch (error) {
    console.error('updateProduct hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// ÜRÜN SİL (sadece admin)
// DELETE /api/products/:id
// -----------------------------------------------
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    await prisma.product.delete({ where: { id } });

    return res.status(200).json({ message: 'Ürün silindi' });

  } catch (error) {
    console.error('deleteProduct hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};