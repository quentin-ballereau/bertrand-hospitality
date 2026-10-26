// le bundler de Webflow expose les classes des modules CSS en exports nommés : import * as styles from "…module.css"
declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export = classes;
}
