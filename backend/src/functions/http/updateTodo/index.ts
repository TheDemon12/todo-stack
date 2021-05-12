import schema from "./schema";
import { handlerPath } from "@libs/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "patch",
				path: "todos/{todoId}",
				request: {
					schema: {
						"application/json": schema,
					},
				},
				cors: true,
				authorizer: "auth",
			},
		},
	],
	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["dynamodb:UpdateItem"],
			Resource:
				"arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}",
		},
	],
};
