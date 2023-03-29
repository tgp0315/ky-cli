#!/usr/bin/env node
const cac = require('cac')
const chalk = require('chalk')
const getPcSource = require('./pc')
const getMbSource = require('./mobile')
const cli = cac('ky')


const onError = err => {
  console.log(chalk.red(err))
  process.exit(1)
}

// 监听未捕获的异常事件
process.on('uncaughtException', onError)
// 监听Promise未捕获的异常事件
process.on('unhandledRejection', onError)

cli
  .command('pc [name]', 'project type')
  .action(async (name, options) => {
    console.log(name, options, 'root')
    if (name) {
      getPcSource(name)
    }
  })
cli
  .command('mb [name]', 'project name')
  .option('-s, --sorce', 'Whether the source is from the base repository?')
  // .option('-n, --name', 'project name')
  .action(async (name, options) => {
    console.log(name, options, 'root')
    getMbSource(name, options)
  })
// cli
//   .command('build  [...otherFiles]', 'Build your app')
//   .option('--foo', 'Foo option')
//   .action((entry, otherFiles, options) => {
//     console.log(entry)
//     console.log(otherFiles)
//     console.log(options)
//   })
  // -h, --help出现标志时输出帮助信息。
cli.help()

cli.parse()
