import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway'
import { formatJSONResponse } from '@libs/apiGateway'
import { middyfy } from '@libs/lambda'
import schema from './schema'
import { createTodo } from '@businessLogic/todos'
import { parseUserId } from 'src/auth/utils'

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const authorizationHeader = event.headers.Authorization
  const jwtToken = authorizationHeader.split(' ')[1]
  const userId = parseUserId(jwtToken)

  if (!event.body.name) return formatJSONResponse({}, 400)

  const todo = await createTodo(event.body, userId)

  return formatJSONResponse(
    {
      item: todo
    },
    201
  )
}

export const main = middyfy(handler)
