export const swaggerStatic = () => {
  return {
    customJs: [
      `${process.env.SWAGGER_CDN_URL}/swagger-ui-bundle.min.js`,
      `${process.env.SWAGGER_CDN_URL}/swagger-ui-standalone-preset.min.js`,
    ],
    customCssUrl: [
      `${process.env.SWAGGER_CDN_URL}/swagger-ui.min.css`,
      `${process.env.SWAGGER_CDN_URL}/swagger-ui-standalone-preset.min.css`,
      `${process.env.SWAGGER_CDN_URL}/swagger-ui.css`,
    ],
  };
}
