import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@example.com', password: adminPassword, role: 'admin' }
  });

  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: { name: 'Nguyen Van A', email: 'user@example.com', password: userPassword, role: 'user' }
  });

  const students = [
    { name: 'Nguyen Thi B', class: '10A1', score: 8.5 },
    { name: 'Tran Van C', class: '10A1', score: 7.0 },
    { name: 'Le Thi D', class: '10A2', score: 9.0 }
  ];

  for (const s of students) {
    await prisma.student.create({ data: { ...s, userId: user.id } });
  }

  console.log('Seed data created ✅');
}

main().catch(console.error).finally(() => prisma.$disconnect());
