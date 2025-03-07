import type { NextApiRequest, NextApiResponse } from 'next/types'
import { z } from 'zod'
import { HandleApiException, LogMethod } from '@dmr.is/decorators'
import { logger } from '@dmr.is/logging'
import { AuthMiddleware } from '@dmr.is/middleware'

import { createDmrClient } from '../../../lib/api/createClient'
import { OJOIWebException } from '../../../lib/constants'

const publishCasesBodySchema = z.object({
  caseIds: z.array(z.string()),
})

class PublishCasesHandler {
  @LogMethod(false)
  @HandleApiException()
  public async handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const dmrClient = createDmrClient()

      const check = publishCasesBodySchema.safeParse(req.body)

      if (!check.success) {
        return res.status(400).json(OJOIWebException.badRequest())
      }

      await dmrClient
        .withMiddleware(new AuthMiddleware(req.headers.authorization))
        .publish({
          postCasePublishBody: {
            caseIds: check.data.caseIds,
          },
        })
      return res.status(204).end()
    } catch (error) {
      logger.warn('Failed to publish cases', {
        context: 'PublishCasesHandler',
        error,
      })

      return res.status(500).json(OJOIWebException.serverError())
    }
  }
}

const instance = new PublishCasesHandler()
export default (req: NextApiRequest, res: NextApiResponse) =>
  instance.handler(req, res)
