Overnight API
===

Environment Variables
---

This project uses environment variables for configuration. These variables can be set from different sources.

### Environment variables sources precedence

The sources have different precedence levels, listed from highest to lowest priority:

1. Native environment variable (`export NAME=VALUE`)
2. `.env.{NODE_ENV}.local`
3. `.env.local`
4. `.env.{NODE_ENV}`
5. `.env`

### Environment files rules

Environment variables can be stored in the following files, each with specific rules and usage scenarios.

#### `.env.{NODE_ENV}.local`
- This file is used only in the `NODE_ENV` environment.
- It is intended for use solely on the local machine.
- It should contain sensitive data related to the `NODE_ENV` environment.

#### `.env.{NODE_ENV}`
- This file is used only in the `NODE_ENV` environment.
- It should not contain sensitive data.

#### `.env.local`
- This file is used in all environments.
- It is intended for use solely on the local machine.
- It should contain sensitive data not specific to any environment.

#### `.env`
- This file is used in all environments.
- It should not contain sensitive data.

### Variables table

Here is a table explaining each environment variable used by the project:

| **Variable name**      | **Description**                                      | **Type** | **Default value in dev env** | **Default value in all env** |
|------------------------|------------------------------------------------------|----------|------------------------------|------------------------------|
| APP_PORT               | The port on which the application runs               | number   | ✅                            | ✅                            |
| POSTGRES_HOST          | Host of the Postgres service                         | string   | ✅                            | ❌                            |
| POSTGRES_PORT          | Port of the Postgres service                         | number   | ✅                            | ❌                            |
| POSTGRES_USERNAME      | Username of the Postgres database user               | string   | ✅                            | ❌                            |
| POSTGRES_PASSWORD      | Password of the Postgres database user               | string   | ✅                            | ❌                            |
| POSTGRES_DATABASE      | Name of the Postgres database                        | string   | ✅                            | ❌                            |
| POSTGRES_SYNCHRONIZE   | Whether to synchronize entities with database models | boolean  | ✅                            | ✅                            |
| ADMINER_PORT           | Port of the Adminer service                          | number   | ✅                            | ❌                            |
| AWS_S3_REGION          | Region of the AWS S3 bucket                          | string   | ✅                            | ❌                            |
| AWS_S3_BUCKET          | Bucket name of the AWS S3 bucket                     | string   | ✅                            | ❌                            |
| AWS_ACCESS_KEY_ID      | Access key id for AWS                                | string   | ❌                            | ❌                            |
| AWS_SECRET_ACCESS_KEY  | Secret access key for AWS                            | string   | ❌                            | ❌                            |
| JWT_SECRET             | Secret for JWT                                       | string   | ✅                            | ❌                            |
| JWT_OPTION_EXPIRES_IN  | JWT expiration time                                  | string   | ✅                            | ❌                            |
| SWAGGER_DOC_VISIBILITY | Determines if the Swagger document is visible        | boolean  | ✅                            | ✅                            |
| NODE_ENV               | Current environment                                  | string   | ✅                            | ❌                            |
