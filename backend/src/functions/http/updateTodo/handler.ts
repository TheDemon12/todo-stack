import "source-map-support/register";

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import schema from "./schema";
import { updateTodo } from "@businessLogic/todos";
import { parseUserId } from "src/auth/utils";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	const todoId = event.pathParameters.todoId;
	const authorizationHeader = event.headers.Authorization;
	const jwtToken = authorizationHeader.split(" ")[1];

	const userId = parseUserId(jwtToken);

	const updatedTodo = await updateTodo(todoId, userId, event.body);

	return formatJSONResponse(
		{
			item: updatedTodo,
		},
		200
	);
};

export const main = middyfy(handler);
