import { PrismaClient } from '@prisma/client';
import { authenticate } from '../_middleware';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const decoded = authenticate(req, res);
  if (!decoded.userId) return;

  if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, students: true },
  });

  return res.status(200).json(users);
}
