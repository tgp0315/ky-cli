const chalk = require('chalk')
const shell = require('shelljs')
const cp = require('child_process')
// shell.exec clone一直报错，这个库可以直接修改模块目录名称
const download = require('download-git-repo')
const fs = require('fs')
const path = require('path')
const logSymbols = require('log-symbols')
const getDepend = require('./getDepend')
const resolve = dir => path.resolve(process.cwd(), dir)
function getMbSource(name, options) {
  const { s } = options
  if (name) {
    fs.exists(resolve(name), function (exists) {
      if (exists) {
        console.log(logSymbols.error, chalk.red('该目录已存在'))
      } else {
        const type = s ? 'base' : 'other'
        if (setGit.get(type)) {
          setGit.get(type)(name)
        }
      }
    })
  }
}

const setGit = new Map([
  ['base', getFromBase],
  ['other', getOther],
])

function getFromBase(name) {
  console.log(chalk.green('开始下载仓库，请稍后....'));
  downLoadTemplate('direct:https://github.com/tgp0315/fast-vue3.git', name).then(async () => {
    const fileName = `${name}/package.json`;
    const data = fs.readFileSync(fileName).toString()
    let json = JSON.parse(data)
    json.name = name
    fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8')
    await getDepend(name, amendPro)
  });
}

function getOther(name) {
  console.log(chalk.green('开始下载仓库，请稍后....'));
  downLoadTemplate(`direct:https://github.com/tgp0315/${name}.git#master`, name).then(
    async () => {
      await getDepend(name)
    }
  );
}

// 新项目删除.git
async function amendPro() {
  await shell.rm('-rf', './.git')
}

async function downLoadTemplate(api, ProjectName) {
  return new Promise((resolve, reject) => {
    download(api, ProjectName, { clone: true }, err => {
      if (err) {
        console.log(logSymbols.error, chalk.red(`仓库下载失败${err}`))
        reject(err)
      } else {
        console.log(logSymbols.success, chalk.blue('仓库下载成功'))
        resolve()
      }
    })
  })
}

module.exports = getMbSource
