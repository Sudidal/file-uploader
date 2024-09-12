import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getPathByFolderId(folderId) {
  let pathSegments = [];
  let fullPath = "";

  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
    },
  });
  if (folder) {
    let curFolder = folder;
    pathSegments.unshift(folder.name);
    while (curFolder.parentFolderId) {
      const parentFolder = await prisma.folder.findFirst({
        where: {
          id: curFolder.parentFolderId,
        },
      });
      pathSegments.unshift(parentFolder.name);
      curFolder = parentFolder;
    }
  }

  fullPath = pathSegments.join("/");
  console.log(pathSegments);

  return fullPath;
}

getPathByFolderId(19);

export { getPathByFolderId };
