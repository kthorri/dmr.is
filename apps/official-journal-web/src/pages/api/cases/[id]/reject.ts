import type { NextApiRequest, NextApiResponse } from 'next/types'
import { HandleApiException, LogMethod, Post } from '@dmr.is/decorators'
import { AuthMiddleware } from '@dmr.is/middleware'

import { createDmrClient } from '../../../../lib/api/createClient'

class RejectHandler {
  @LogMethod(false)
  @HandleApiException()
  @Post()
  public async handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query as { id?: string }

    if (!id) {
      return res.status(400).end()
    }

    const dmrClient = createDmrClient()

    await dmrClient
      .withMiddleware(new AuthMiddleware(req.headers.authorization))
      .rejectCase({
        id: id,
      })

    return res.status(204).end()
  }
}

const instance = new RejectHandler()
export default (req: NextApiRequest, res: NextApiResponse) =>
  instance.handler(req, res)
