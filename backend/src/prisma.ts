import { PrismaClient } from '@prisma/client';

// PrismaClient'ı tek bir yerden yönetiyoruz
// Neden? Her dosyada new PrismaClient() yaparsak
// onlarca veritabanı bağlantısı açılır, bu kötüdür
const prisma = new PrismaClient();

export default prisma;