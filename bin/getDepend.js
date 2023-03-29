const shell = require('shelljs')
// 为了更方便的判断命名执行状态，使用了child_process
const child =require("child_process")
const chalk = require('chalk')
const logSymbols = require('log-symbols')
const path = require('path')
const resolve = dir => path.resolve(process.cwd(),  dir)

async function getDepend(name , cb) {
  await shell.cd(`${resolve(name)}`)
  if (cb) {
    await cb(name)
  }
  await loadModules()
}

async function loadModules() {

  // 判断是否安装了yarn
  if (shell.which('yarn')) {
    await loadCmd(`yarn`)
    return
  }
  if (shell.which('cnpm')) {
    await loadCmd(`cnpm install`)
    return
  }
  if (shell.which('npm')) {
    await loadCmd(`npm install`)
  }
  if (shell.which('pnpm')) {
    await loadCmd(`pnpm install`)
  }
  console.log(logSymbols.error, chalk.red(`请安装包管理工具yarn or cnpm or npm or pnpm`))
}

async function loadCmd(cmd) {
  console.log(chalk.green("正在安装依赖，请耐心等待..."))
  // const { code, stdout }  = shell.exec(cmd)
  // if (code !== 0) {
  //   console.log(logSymbols.success, chalk.blue('仓库下载成功'))
  // } else {
  //   console.log(logSymbols.error, chalk.red(`仓库下载失败  ${stdout}`))
  // }
  await child.exec(cmd, async (error, stdout, stderr) => {
    if(error) {
      console.log(logSymbols.error, chalk.red(`安装依赖失败${error}`))
      return
    }
    console.log(logSymbols.success, chalk.blue(`安装依赖成功`))
    await shell.exit(1)
  })
}

module.exports = getDepend
