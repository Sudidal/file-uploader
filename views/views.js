import process from "node:process";

class Views {
  constructor() {}

  #rootPath = process.cwd();

  //----------------  Pages
  layout = this.#rootPath + "/views/layout";
  index = this.#rootPath + "/views/index";
  signup = this.#rootPath + "/views/signup";
  login = this.#rootPath + "/views/login";

  //----------------  Partials
  fileNodeList = this.#rootPath + "/views/partials/fileNodeList";
}

const views = new Views();
export default views;
