import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

const getNote = async (id: number) => {
  const note = await prisma.note.findFirst({ where: { id: id } });
  return note;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const note = await getNote(body);
  res.status(200).json({ note: note });
}
