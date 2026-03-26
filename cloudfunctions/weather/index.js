/**
 * 天气查询云函数
 * 使用和风天气免费API (https://dev.qweather.com/)
 * 注册后获取免费KEY，填入 QWEATHER_KEY
 */
const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

// 替换为你的和风天气API Key
const QWEATHER_KEY = '5badfe04746d4bdb91bb35901759f75d'

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch (e) { reject(e) }
      })
    }).on('error', reject)
  })
}

exports.main = async (event) => {
  const { city, date } = event
  // city: 城市名或LocationID
  // date: YYYY-MM-DD

  try {
    // 1. 先查城市LocationID
    const geoUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&key=${QWEATHER_KEY}`
    const geoData = await httpsGet(geoUrl)

    if (!geoData.location || geoData.location.length === 0) {
      return { success: false, message: '未找到该城市' }
    }

    const locationId = geoData.location[0].id
    const locationName = geoData.location[0].name

    // 2. 查7天天气预报
    const weatherUrl = `https://devapi.qweather.com/v7/weather/7d?location=${locationId}&key=${QWEATHER_KEY}`
    const weatherData = await httpsGet(weatherUrl)

    if (weatherData.code !== '200') {
      return { success: false, message: '天气查询失败' }
    }

    // 找目标日期
    const dayData = weatherData.daily.find(d => d.fxDate === date)
    if (!dayData) {
      return { success: false, message: '超出预报范围（仅支持7天内）' }
    }

    // 根据天气生成着装建议
    const outfit = getOutfitSuggestion(dayData)

    return {
      success: true,
      location: locationName,
      date,
      weather: dayData.textDay,
      tempMin: dayData.tempMin,
      tempMax: dayData.tempMax,
      windDir: dayData.windDirDay,
      windScale: dayData.windScaleDay,
      humidity: dayData.humidity,
      uvIndex: dayData.uvIndex,
      outfit
    }
  } catch (e) {
    return { success: false, message: e.message || '查询失败' }
  }
}

function getOutfitSuggestion(day) {
  const temp = parseInt(day.tempMax)
  const weather = day.textDay

  let suggestion = []

  // 温度建议
  if (temp >= 30) {
    suggestion.push('天气较热，建议选择轻薄透气的服装')
  } else if (temp >= 20) {
    suggestion.push('温度适宜，单件薄外套或正装均可')
  } else if (temp >= 10) {
    suggestion.push('温度较凉，建议穿外套，里面搭配正装')
  } else {
    suggestion.push('天气较冷，建议穿保暖外套，注意脚部保暖')
  }

  // 天气建议
  if (weather.includes('雨') || weather.includes('雪')) {
    suggestion.push('当天有降水，建议备伞，注意鞋子防水，裙摆不宜过长')
  } else if (weather.includes('晴')) {
    suggestion.push('天气晴好，可以选择白色或浅色正装，效果更好看')
  }

  // 妆容建议
  if (weather.includes('雨') || parseInt(day.humidity) > 80) {
    suggestion.push('湿度较高，建议选用持久防水的妆容产品')
  } else if (weather.includes('晴') && temp >= 25) {
    suggestion.push('阳光充足，注意防晒，妆容选择控油型')
  }

  return suggestion
}
