import { PrismaClient, Role } from "@/app/generated/prisma/client";
import { faker } from "@faker-js/faker";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const main = async () => {
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash("123456", 10);
  const roles: Role[] = [Role.MANAGER, Role.EMPLOYEE];

  const usersData = Array.from({ length: 20 }, (_, i) => ({
    fullName: faker.person.fullName(),
    username: i === 0 ? "admin" : faker.internet.username(),
    password: hashedPassword,
    role: i === 0 ? Role.ADMIN : faker.helpers.arrayElement(roles),
    isActive: faker.datatype.boolean(0.8),
  }));

  await prisma.user.createMany({
    data: usersData,
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
