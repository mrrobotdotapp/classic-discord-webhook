import * as core from '@actions/core'
import * as github from '@actions/github'
import { send } from './discord.js'

async function run() {
  const id = core.getInput('id')
  const token = core.getInput('token')
  const threadId = core.getInput('threadId') || undefined

  const { payload } = github.context
  const repository = payload.repository.full_name
  const commits = payload.commits ?? []
  const branch = payload.ref.split('/').pop()

  core.info(`Received ${commits.length} commit(s) on ${branch}`)

  if (commits.length === 0) {
    core.info('No commits, skipping.')
    return
  }

  await send(id, token, repository, branch, payload.compare, commits, threadId)
}

run().catch((error) => core.setFailed(error.message))
