import { PrismaClient } from '@prisma/client';
import { authenticate } from '../_middleware';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const decoded = authenticate(req, res);
  if (!decoded.userId) return;

  const userId = decoded.userId;

  if (decoded.role === 'admin') {
    // Tổng số user + tổng học sinh
    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.student.count();
    return res.status(200).json({ totalUsers, totalStudents });
  }

  // User: thống kê học sinh riêng
  const students = await prisma.student.findMany({ where: { userId } });
  const averageScore =
    students.length > 0
      ? students.reduce((sum, s) => sum + s.score, 0) / students.length
      : 0;

  return res.status(200).json({ studentCount: students.length, averageScore });
}
