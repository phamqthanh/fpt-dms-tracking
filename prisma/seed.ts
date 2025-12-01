import prisma from '../lib/prisma'

async function main() {
  // Tạo users
  const user1 = await prisma.user.upsert({
    where: { email: 'nguyen.van.a@example.com' },
    update: {},
    create: {
      name: 'Nguyễn Văn A',
      email: 'nguyen.van.a@example.com',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'tran.thi.b@example.com' },
    update: {},
    create: {
      name: 'Trần Thị B',
      email: 'tran.thi.b@example.com',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'le.van.c@example.com' },
    update: {},
    create: {
      name: 'Lê Văn C',
      email: 'le.van.c@example.com',
    },
  });

  // Tạo locations - một số địa điểm ở Việt Nam
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Nhà hát Thành phố',
        latitude: 10.776889,
        longitude: 106.704139,
        userId: user1.id,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Chợ Bến Thành',
        latitude: 10.772461,
        longitude: 106.698055,
        userId: user1.id,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Bitexco Financial Tower',
        latitude: 10.771667,
        longitude: 106.704167,
        userId: user2.id,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Đài Tưởng niệm Liệt sĩ',
        latitude: 10.766667,
        longitude: 106.683333,
        userId: user2.id,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Landmark 81',
        latitude: 10.794944,
        longitude: 106.721806,
        userId: user3.id,
      },
    }),
    prisma.location.create({
      data: {
        name: 'Vincom Center',
        latitude: 10.779167,
        longitude: 106.699444,
        userId: user3.id,
      },
    }),
  ]);

  console.log('Seeded users:', { user1, user2, user3 });
  console.log('Seeded locations:', locations.length);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

