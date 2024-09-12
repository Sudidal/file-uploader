import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class CustomValidators {
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

const customValidators = new CustomValidators();
export default customValidators;
