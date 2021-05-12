import "source-map-support/register";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { getAllTodos } from "@businessLogic/todos";
import { parseUserId } from "src/auth/utils";

const getTodos: APIGatewayProxyHandler = async (
	event: APIGatewayProxyEvent
) => {
	const authorizationHeader = event.headers.Authorization;
	const jwtToken = authorizationHeader.split(" ")[1];

	const userId = parseUserId(jwtToken);

	const todos = await getAllTodos(userId);
	return formatJSONResponse({ items: todos }, 200);
};

export const main = middyfy(getTodos);
