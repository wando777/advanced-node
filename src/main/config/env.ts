export default {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_SECRET_ID ?? '',
    accessToken: process.env.FB_ACCESS_TOKEN ?? ''
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'tokenjwt'
}
