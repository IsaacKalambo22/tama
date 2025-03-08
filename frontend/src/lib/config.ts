const config = {
  env: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_ENDPOINT!,
    prodApiEndpoint:
      process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,

    aws: {
      accessKey:
        process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
      secretAccessKey:
        process.env
          .NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
      bucketName:
        process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      bucketRegion:
        process.env
          .NEXT_PUBLIC_AWS_BUCKET_REGION!,
      folderPath:
        process.env.NEXT_PUBLIC_AWS_FOLDER_PATH!,
      cloudFrontDomain:
        process.env
          .NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN!,
    },

    upstash: {
      redisUrl: process.env.UPSTASH_REDIS_URL!,
      redisToken:
        process.env.UPSTASH_REDIS_TOKEN!,
      qstashUrl: process.env.QSTASH_URL!,
      qstashToken: process.env.QSTASH_TOKEN!,
    },
    resendToken: process.env.RESEND_TOKEN!,
  },
};

export default config;
