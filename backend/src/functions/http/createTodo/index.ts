import schema from "./schema";
import { handlerPath } from "@libs/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "post",
				path: "todos",
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
			Action: ["dynamodb:PutItem"],
			Resource:
				"arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}",
		},
	],
};
