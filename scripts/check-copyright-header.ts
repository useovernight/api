/**
 * Copyright (c) Overnight
 */

/* eslint-disable no-console */
import fs from 'node:fs/promises'
import process from 'node:process'
import chalk from 'chalk'

const CopyrightHeader = [
  '/**',
  ' * Copyright (c) Overnight',
  ' */',
  '',
  ''
].join('\n')

class CopyrightHeaderError extends Error {
  constructor(public readonly filepath: string) {
    super(`The file ${filepath} does not contain the correct copyright header.`)
  }
}

const isCopyrightHeaderError = (
  error: unknown
): error is CopyrightHeaderError => error instanceof CopyrightHeaderError

const checkCopyrightInFile = async (filepath: string) => {
  const content = await fs.readFile(filepath, {
    encoding: 'utf8'
  })

  if (!content.startsWith(CopyrightHeader))
    throw new CopyrightHeaderError(filepath)
}

const check = async (files: string[]) => {
  const checks = files.map(async (filepath) => checkCopyrightInFile(filepath))

  const results = await Promise.allSettled(checks)
  const rejected = results.filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected'
  )

  if (rejected.length === 0) return

  console.error('Copyright header check failed for the following files:')
  console.error()

  for (const result of rejected) {
    const reason = result.reason

    if (isCopyrightHeaderError(reason)) {
      console.error(` ${chalk.dim('•')} ${reason.filepath}`)
    } else {
      console.error(` ${chalk.dim('• Unknown error')}`)
    }
  }

  console.error()
  /* eslint-disable-next-line unicorn/no-process-exit */
  process.exit(1)
}

const files = process.argv.slice(2)
void check(files)
