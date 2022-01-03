export interface IEnv {
  MONGODB_URI: string
  API_PREFIX: string
  API_SWAGGER_URL: string
  API_PORT: string
  JWT_SECRET_KEY: string | number
  JWT_EXPIRES_IN: string | number
  NODE_ENV: string
}
