const core = require('@actions/core')
const github = require('@actions/github')

const webhook = require('../src/discord.js')

async function run () {
  const payload = await github.context.payload
  const repository = payload.repository.full_name
  const commits = payload.commits
  const size = commits.length
  const branch = payload.ref.split('/')[payload.ref.split('/').length - 1]

  console.log('Received payload.')

  console.log(`Received ${commits.length}/${size} commits...`)

  if (commits.length === 0) {
    console.log('No commits, skipping...')
    return
  }

  const id = core.getInput('id')
  const token = core.getInput('token')
  const threadId = core.getInput('threadId')

  webhook
    .send(
      id,
      token,
      repository,
      branch,
      payload.compare,
      commits,
      size,
      threadId
    )
    .catch((err) => core.setFailed(err.message))
}

try {
  run()
} catch (error) {
  core.setFailed(error.message)
}
