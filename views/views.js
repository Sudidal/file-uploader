import process from "node:process";

class Views {
  constructor() {}

  #rootPath = process.cwd();

  //----------------  Pages
  layout = this.#rootPath + "/views/layout";
  files = this.#rootPath + "/views/files";
  signup = this.#rootPath + "/views/signup";
  login = this.#rootPath + "/views/login";

  //----------------  Partials
  fileNodeList = this.#rootPath + "/views/partials/fileNodeList";
  fileCard = this.#rootPath + "/views/partials/fileCard";
  folderCard = this.#rootPath + "/views/partials/folderCard";
}

const views = new Views();
export default views;
