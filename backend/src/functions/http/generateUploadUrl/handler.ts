import "source-map-support/register";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { getAttachmentUploadUrl } from "@businessLogic/todos";

const generateUploadUrl: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
) => {
	const todoId = event.pathParameters.todoId;

	const uploadUrl = await getAttachmentUploadUrl(todoId);
	return formatJSONResponse({ uploadUrl }, 200);
};

export const main = middyfy(generateUploadUrl);
