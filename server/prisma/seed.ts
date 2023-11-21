import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dummy = await prisma.user.upsert({
    where: { email: 'dummy@mail.com' },
    update: {},
    create: {
      email: 'dummy@mail.com',
      first_name: 'Dummy',
      last_name: 'User',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      profile_pic_url:
        'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499455/avatars/1/h1hhribuj7xiffrndplr.jpg',
    },
  });

  const oscar = await prisma.user.upsert({
    where: { email: 'oscar@gmail.com' },
    update: {},
    create: {
      email: 'oscar@mail.com',
      first_name: 'Oscar',
      last_name: 'Zhu',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      profile_pic_url:
        'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499467/avatars/2/zeutw7y3ycd4h7c8a8eu.jpg',
    },
  });

  const aryan = await prisma.user.upsert({
    where: { email: 'aryan@mail.com' },
    update: {},

    create: {
      email: 'aryan@mail.com',
      first_name: 'Aryan',
      last_name: 'Jand',
      password: '$2a$12$KfR9eNC9fxFBviwsjWffaOeuGNw3QJL6ubqg9KfP9gJw/JMMAMf8O',
      profile_pic_url:
        'https://res.cloudinary.com/dj6rvkhvo/image/upload/v1697499479/avatars/3/l3xnzzi2hqww2ulfiblq.jpg',
    },
  });

  console.log({ dummy, oscar, aryan });
}

main()
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
