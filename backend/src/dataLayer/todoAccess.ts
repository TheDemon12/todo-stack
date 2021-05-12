import { UpdateTodoRequest } from "./../requests/UpdateTodoRequest";
import { TodoItem } from "@models/TodoItem";
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";
import { createLogger } from "@utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);

export class TodoAccess {
	constructor(
		private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
		private readonly todosTable = process.env.TODOS_TABLE,
		private readonly logger = createLogger("todo")
	) {}

	async getAllTodos(userId: string) {
		this.logger.info("Getting all Todos of user: ", userId);

		const result = await this.docClient
			.query({
				TableName: this.todosTable,
				KeyConditionExpression: "userId = :userId",
				ExpressionAttributeValues: {
					":userId": userId,
				},
				ScanIndexForward: false,
			})
			.promise();

		this.logger.info(result);

		return result.Items as TodoItem[];
	}

	async createTodo(todo: TodoItem): Promise<TodoItem> {
		this.logger.info("Creating a todo with id: ", todo.todoId);

		await this.docClient
			.put({
				TableName: this.todosTable,
				Item: todo,
			})
			.promise();

		return todo;
	}

	async updateTodo(
		todoId: string,
		userId: string,
		updateTodo: UpdateTodoRequest
	): Promise<TodoItem> {
		this.logger.info("Updating a todo with id: ", todoId);

		const result = await this.docClient
			.update({
				TableName: this.todosTable,
				Key: { todoId, userId },
				UpdateExpression: "set dueDate=:dueDate, done=:done, #NameField=:name",
				ExpressionAttributeNames: {
					"#NameField": "name",
				},
				ExpressionAttributeValues: {
					":dueDate": updateTodo.dueDate,
					":done": updateTodo.done,
					":name": updateTodo.name,
				},
				ReturnValues: "ALL_NEW",
			})
			.promise();

		return result.Attributes as TodoItem;
	}

	async deleteTodo(todoId: string, userId: string): Promise<TodoItem> {
		this.logger.info("Deleting a todo with id: ", todoId);

		const result = await this.docClient
			.delete({
				TableName: this.todosTable,
				Key: { todoId, userId },
				ReturnValues: "ALL_OLD",
			})
			.promise();

		return result.Attributes as TodoItem;
	}
}
