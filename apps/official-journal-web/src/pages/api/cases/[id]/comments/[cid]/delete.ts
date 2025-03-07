import type { NextApiRequest, NextApiResponse } from 'next/types'
import { Delete, HandleApiException, LogMethod } from '@dmr.is/decorators'
import { AuthMiddleware } from '@dmr.is/middleware'

import { createDmrClient } from '../../../../../../lib/api/createClient'

class DeleteCommentHandler {
  @LogMethod(false)
  @HandleApiException()
  @Delete()
  public async handler(req: NextApiRequest, res: NextApiResponse) {
    const { id, cid } = req.query as { id?: string; cid?: string }

    if (!id || !cid) {
      return res.status(400).end()
    }

    const dmrClient = createDmrClient()

    await dmrClient
      .withMiddleware(new AuthMiddleware(req.headers.authorization))
      .deleteComment({
        id: id,
        commentId: cid,
      })
    return res.status(204).end()
  }
}

const instance = new DeleteCommentHandler()
export default (req: NextApiRequest, res: NextApiResponse) =>
  instance.handler(req, res)
