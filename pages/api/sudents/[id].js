import { PrismaClient } from '@prisma/client';
import { authenticate } from '../_middleware';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const decoded = authenticate(req, res);
  if (!decoded.userId) return;

  const userId = decoded.userId;
  const { id } = req.query;

  if (req.method === 'GET') {
    const student = await prisma.student.findFirst({ where: { id: Number(id), userId } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    return res.status(200).json(student);
  }

  if (req.method === 'PUT') {
    const { name, class: className, score } = req.body;
    const updated = await prisma.student.updateMany({
      where: { id: Number(id), userId },
      data: { name, class: className, score },
    });
    if (updated.count === 0) return res.status(404).json({ error: 'Student not found' });
    return res.status(200).json({ message: 'Updated successfully' });
  }

  if (req.method === 'DELETE') {
    const deleted = await prisma.student.deleteMany({ where: { id: Number(id), userId } });
    if (deleted.count === 0) return res.status(404).json({ error: 'Student not found' });
    return res.status(200).json({ message: 'Deleted successfully' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
