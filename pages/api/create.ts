import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

const createTestNote = async () => {
  await prisma.note.create({
    data: {
      title: 'Test Note',
      content: 'Test Content',
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await createTestNote();
  res.status(200).json({ status: 'Note Created' });
}
