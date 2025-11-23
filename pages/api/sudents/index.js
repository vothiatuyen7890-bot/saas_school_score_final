import { PrismaClient } from '@prisma/client';
import { authenticate } from '../_middleware';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const decoded = authenticate(req, res);
  if (!decoded.userId) return; // authenticate đã trả về lỗi

  const userId = decoded.userId;

  if (req.method === 'GET') {
    const students = await prisma.student.findMany({ where: { userId } });
    return res.status(200).json(students);
  }

  if (req.method === 'POST') {
    const { name, class: className, score } = req.body;
    if (!name || !className || score === undefined)
      return res.status(400).json({ error: 'Missing fields' });

    const student = await prisma.student.create({
      data: { name, class: className, score, userId },
    });

    return res.status(201).json(student);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
