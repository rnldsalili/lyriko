import { createRouter } from '@/api/lib/app';

const songs = createRouter()
  .basePath('/songs')
  .get('/', async (c) => {
    const prisma = c.get('prisma');

    const songs = await prisma.song.findMany({
      where: {
        isPublished: true,
      },
    });

    return c.json(songs);
  });

export default songs;
