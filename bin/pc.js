const chalk = require('chalk')
const shell = require('shelljs')
const fs = require('fs')
const path = require('path')
const logSymbols = require('log-symbols')
const getDepend = require('./getDepend')
const resolve = dir => path.resolve(process.cwd(), dir)
function getPcSource(name) {
  if (name) {
    fs.exists(resolve(name), function (exists) {
      if (exists) {
        console.log(logSymbols.error, chalk.red('该目录已存在'))
      } else {
        const type = name === 'base' ? 'base' : 'other'
        if (setGit.get(type)) {
          setGit.get(type)(name)
        }
      }
    })
  }
}

const setGit = new Map([
  ['base', getBase],
  ['other', getOther],
]);

function getBase(name) {
  console.log(chalk.green('开始下载仓库，请稍后....'));
  const { code, stdout } = shell.exec(
    'git clone -b master https://github.com/tgp0315/fast-vue3.git'
  )
  if (code !== 0) {
    console.log(logSymbols.success, chalk.blue('仓库下载成功'));
    getDepend(name)
  } else {
    console.log(logSymbols.error, chalk.red(`仓库下载失败  ${stdout}`))
  }
}

function getOther(name) {
  // 判断是否在base目录下执行
  if (!process.cwd().includes('base')) {
    console.log(logSymbols.error, chalk.red('请在base目录下执行'))
    return
  }
  console.log(chalk.green('开始下载仓库，请稍后....'))
  const { code, stdout } = shell.exec(
    `https://github.com/tgp0315/${name}.git`
  );
  if (code !== 0) {
    console.log(logSymbols.success, chalk.blue('仓库下载成功'))
  } else {
    console.log(logSymbols.error, chalk.red(`仓库下载失败  ${stdout}`))
  }
}

module.exports = getPcSource;
