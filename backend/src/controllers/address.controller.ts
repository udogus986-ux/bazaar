import { Request, Response } from 'express';
import prisma from '../prisma';

// -----------------------------------------------
// ADRESLERİ GETİR
// GET /api/addresses
// -----------------------------------------------
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    return res.status(200).json({ addresses });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// ADRES EKLE
// POST /api/addresses
// -----------------------------------------------
export const createAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, fullName, phone, city, district, address, zipCode, isDefault } = req.body;

    if (!title || !fullName || !phone || !city || !district || !address) {
      return res.status(400).json({ message: 'Tüm zorunlu alanları doldurun' });
    }

    // Eğer varsayılan olarak işaretlendiyse diğerlerini kaldır
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    // İlk adres otomatik varsayılan olsun
    const count = await prisma.address.count({ where: { userId } });

    const newAddress = await prisma.address.create({
      data: {
        userId, title, fullName, phone,
        city, district, address,
        zipCode: zipCode || null,
        isDefault: isDefault || count === 0,
      },
    });

    return res.status(201).json({ message: 'Adres eklendi', address: newAddress });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// ADRES GÜNCELLE
// PUT /api/addresses/:id
// -----------------------------------------------
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const { title, fullName, phone, city, district, address, zipCode, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: { title, fullName, phone, city, district, address, zipCode, isDefault },
    });

    return res.status(200).json({ message: 'Adres güncellendi', address: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// ADRES SİL
// DELETE /api/addresses/:id
// -----------------------------------------------
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.address.delete({ where: { id } });
    return res.status(200).json({ message: 'Adres silindi' });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// VARSAYILAN ADRES YAP
// PUT /api/addresses/:id/default
// -----------------------------------------------
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return res.status(200).json({ message: 'Varsayılan adres güncellendi' });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};