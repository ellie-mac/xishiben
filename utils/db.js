const db = wx.cloud.database()
const _ = db.command

// 获取集合引用
const col = name => db.collection(name)

// 通用查询（自动带 projectId 过滤）
async function query(collection, extra = {}) {
  const app = getApp()
  const projectId = app.globalData.projectId
  if (!projectId) return []
  try {
    const res = await col(collection).where({ projectId, ...extra }).get()
    return res.data
  } catch (e) {
    console.error(`query ${collection} failed`, e)
    return []
  }
}

// 新增文档
async function add(collection, data) {
  const app = getApp()
  const projectId = app.globalData.projectId
  const openId = app.globalData.openId
  return col(collection).add({
    data: {
      ...data,
      projectId,
      createdBy: openId,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    }
  })
}

// 更新文档
async function update(collection, id, data) {
  return col(collection).doc(id).update({
    data: {
      ...data,
      updatedAt: db.serverDate()
    }
  })
}

// 删除文档
async function remove(collection, id) {
  return col(collection).doc(id).remove()
}

// 获取单个文档
async function get(collection, id) {
  try {
    const res = await col(collection).doc(id).get()
    return res.data
  } catch (e) {
    return null
  }
}

// 查询项目信息
async function getProject(projectId) {
  try {
    const res = await col('projects').doc(projectId).get()
    return res.data
  } catch (e) {
    return null
  }
}

module.exports = { db, _, col, query, add, update, remove, get, getProject }
