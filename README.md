# Resize Image Service (AWS Serverless / Terraform / Typescript)

A serverless resize image backend with AWS that can be deployed end-to-end using Terraform in minutes.

## Tech Stack
- **TypeScript**
- **AWS Lambda**
- **API Gateway**
- **AWS S3**
- **AWS SQS**
- **Terraform (IaC)**

## Features
- Resize image width to 200, 400, 600, 800 px.
- Automatic redirection using `GET /image/{imageId}/{width}`.
- Infrastructure as Code with **Terraform**.
- Fully serverless, highly scalable & low-cost.
- Built with **Node.js + TypeScript**.

## Prerequisite
- Nodejs
- NPM
- Terraform
- AWS account
- AWS CLI **and credentials configured**


> Terraform requires valid AWS credentials.  
> Run `aws configure` or export environment variables before running any Terraform commands.

## Installation & Deployment 
Clone the repo
> git clone https://github.com/leconghieu/image-resize.git

Install dependencies and init infra
> npm run setup

Build and zip lambda functions
> npm run build

Deploy
> npm run infra:deploy

## How to test
> 💡 If you don’t want to deploy the infrastructure, you can test using this `api_endpoint`.
https://qwiih5jy9b.execute-api.eu-central-1.amazonaws.com

You can use Postman to send a POST request like this to the endpoint `https://<api-domain>/upload`.

Expample Request:
```
curl -X POST https://<api-domain>/upload \
  -H "x-filename: test" \
  --data-binary "@test.jpg"
```

→ Example Response:
```bash
{
  "original": "https://<s3-bucket-domain>/original_images/...."
  "imageId": "onzvmi-test"
}
```

Then you can open the browser and access to this url `https://<api-domain>/image/{imageId}/{width}
> _(The width must be one of 200 | 400 | 600 | 800)_

Example: https://qwiih5jy9b.execute-api.eu-central-1.amazonaws.com/image/sg9c2q-funnycat2/400

## To Improve
- A good UI would be easier for user to upload image.
- Add unit tests.
- Add ESLint + Prettier CI checks before deployment.
- Add rate limiting and security enhancements.
