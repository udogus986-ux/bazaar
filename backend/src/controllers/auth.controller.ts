import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';

// -----------------------------------------------
// KAYIT OL
// POST /api/auth/register
// Body: { name, email, password }
// -----------------------------------------------
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Alanlar dolu mu kontrol et
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    // 2. Bu email daha önce kayıt olmuş mu?
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
    }

    // 3. Şifreyi şifrele
    // 10 = "salt rounds" — ne kadar yüksekse o kadar güvenli ama yavaş
    // 10 iyi bir denge noktası
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Kullanıcıyı veritabanına kaydet
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Düz şifreyi ASLA saklama
      }
    });

    // 5. JWT token üret
    // İçine kullanıcı ID ve rolü koyuyoruz
    // Böylece sonraki isteklerde kim olduğunu biliriz
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } // 7 gün geçerli
    );

    // 6. Kullanıcıya token ve bilgilerini gönder
    // Şifreyi ASLA response'a ekleme
    return res.status(201).json({
      message: 'Kayıt başarılı',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Register hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// GİRİŞ YAP
// POST /api/auth/login
// Body: { email, password }
// -----------------------------------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Alanlar dolu mu?
    if (!email || !password) {
      return res.status(400).json({ message: 'Email ve şifre zorunludur' });
    }

    // 2. Bu email ile kayıtlı kullanıcı var mı?
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Güvenlik: "email bulunamadı" deme, genel mesaj ver
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    // 3. Girilen şifre ile veritabanındaki şifreyi karşılaştır
    // bcrypt.compare() düz şifre ile hash'i karşılaştırır
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email veya şifre hatalı' });
    }

    // 4. JWT token üret
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // 5. Token ve kullanıcı bilgilerini gönder
    return res.status(200).json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('Login hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// -----------------------------------------------
// BENİ KİM? (Token ile kullanıcı bilgisi al)
// GET /api/auth/me
// Header: Authorization: Bearer <token>
// -----------------------------------------------
export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user middleware tarafından ekleniyor (bir sonraki dosyada göreceğiz)
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // password: false — şifreyi asla gönderme
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    return res.status(200).json({ user });

  } catch (error) {
    console.error('GetMe hatası:', error);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};