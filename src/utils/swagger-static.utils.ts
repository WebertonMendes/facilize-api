import { createWriteStream } from "fs";
import { get } from "http";

export function swaggerStatic() {
  get(`${process.env.STATIC}/swagger-ui-bundle.js`, (response) => {
    response.pipe(createWriteStream("public/swagger-ui-bundle.js"));
  });

  get(`${process.env.STATIC}/swagger-ui-init.js`, (response) => {
    response.pipe(createWriteStream("public/swagger-ui-init.js"));
  });

  get(`${process.env.STATIC}/swagger-ui-standalone-preset.js`, (response) => {
    response.pipe(createWriteStream("public/swagger-ui-standalone-preset.js"));
  });

  get(`${process.env.STATIC}/swagger-ui.css`, (response) => {
    response.pipe(createWriteStream("public/swagger-ui.css"));
  });
}
