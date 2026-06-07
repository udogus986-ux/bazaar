import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Bu middleware korumalı route'larda kullanılır
// Örnek: Sepete ürün eklemek için giriş yapmış olmak gerekir
// Route'a istekten önce bu fonksiyon çalışır
// Token geçerliyse devam eder, değilse 401 döner

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Token header'dan gelir: "Authorization: Bearer eyJhbGc..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token bulunamadı, giriş yapın' });
    }

    // "Bearer eyJhbGc..." → "eyJhbGc..." al
    const token = authHeader.split(' ')[1];

    // Token'ı doğrula ve içindeki bilgileri çıkar
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Kullanıcı bilgisini request'e ekle
    // Böylece controller'da req.user.userId diyebiliriz
    (req as any).user = decoded;

    // Her şey tamam, bir sonraki fonksiyona geç
    next();

  } catch (error) {
    // Token süresi dolmuş veya geçersiz
    return res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş' });
  }
};

// Sadece adminlerin erişebileceği endpoint'ler için
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Bu işlem için admin yetkisi gerekli' });
  }

  next();
};