import { getInput, info, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { send } from './discord.js'

async function run() {
  const id = getInput('id')
  const token = getInput('token')
  const threadId = getInput('threadId') || undefined

  const { payload } = context
  const repository = payload.repository.full_name
  const commits = payload.commits ?? []
  const branch = payload.ref.split('/').pop()

  info(`Received ${commits.length} commit(s) on ${branch}`)

  if (commits.length === 0) {
    info('No commits, skipping.')
    return
  }

  await send(id, token, repository, branch, payload.compare, commits, threadId)
}

run().catch((error) => setFailed(error.message))
