export default {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '1001036524549960',
    clientSecret: process.env.FB_SECRET_ID ?? '389cddbfdc9f6bd63e84a27e5eefdd26'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'tokenjwt'
}
