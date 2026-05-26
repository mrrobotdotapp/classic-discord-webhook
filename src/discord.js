import { info } from '@actions/core'

const DISCORD_WEBHOOK_BASE = 'https://discord.com/api/webhooks'
const MAX_COMMIT_SUBJECT_LENGTH = 72
const MAX_COMMITS_DISPLAYED = 8
const EMBED_COLOR = 0x00bb22

export async function send(id, token, repo, branch, compareUrl, commits, threadId) {
  if (!id || !token) {
    throw new Error('Webhook ID or token is missing')
  }

  const url = new URL(`${DISCORD_WEBHOOK_BASE}/${id}/${token}`)
  url.searchParams.set('with_components', 'true')
  if (threadId) {
    if (!/^\d+$/.test(threadId)) {
      throw new Error(`threadId must be a numeric Discord snowflake, got: "${threadId}"`)
    }
    url.searchParams.set('thread_id', threadId)
  }

  info('Sending to Discord...')

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload(repo, branch, compareUrl, commits))
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Discord API error ${response.status}: ${body}`)
  }

  info('Message sent successfully!')
}

function createPayload(repo, branch, compareUrl, commits) {
  const size = commits.length
  const latest = commits[0]
  const authorUsername = latest.author?.username ?? 'unknown'

  return {
    flags: 1 << 15,
    components: [{
      type: 17,
      accent_color: EMBED_COLOR,
      components: [
        {
          type: 10,
          content: `### [${size} ${size === 1 ? 'commit' : 'commits'} pushed to **${branch}**](<${compareUrl}>)`
        },
        {
          type: 10,
          content: getChangelog(commits)
        },
        {
          type: 10,
          content: `-# By @${authorUsername} · ${repo}`
        }
      ]
    }]
  }
}

function getChangelog(commits) {
  let changelog = ''

  for (let i = 0; i < commits.length; i++) {
    if (i >= MAX_COMMITS_DISPLAYED) {
      changelog += `+ ${commits.length - i} more...`
      break
    }

    const { id, url, message } = commits[i]
    const sha = id.substring(0, 7)
    const subject = message.length > MAX_COMMIT_SUBJECT_LENGTH
      ? `${message.substring(0, MAX_COMMIT_SUBJECT_LENGTH)}...`
      : message

    changelog += `[\`${sha}\`](<${url}>) ${subject}\n`
  }

  return changelog.trimEnd()
}
