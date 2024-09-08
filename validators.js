import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class Validators {
  constructor() {}

  async isUserNotExist(value) {
    const user = await prisma.user.findFirst({
      where: {
        username: value,
      },
    });
    if (user) throw new Error();
    else return true;
  }
}

const validators = new Validators();
export default validators;
