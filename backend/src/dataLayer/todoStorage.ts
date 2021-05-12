import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

const XAWS = AWSXRay.captureAWS(AWS);

export default class TodosStorage {
	constructor(
		private readonly todosStorage = process.env.ATTACHMENTS_BUCKET,
		private readonly s3 = new XAWS.S3({ signatureVersion: "v4" })
	) {}

	getBucketName() {
		return this.todosStorage;
	}

	async getAttachmentUploadUrl(todoId: string): Promise<string> {
		return this.s3.getSignedUrl("putObject", {
			Bucket: this.todosStorage,
			Key: todoId,
			Expires: 3000,
		});
	}
}
