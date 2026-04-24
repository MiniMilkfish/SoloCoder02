import { useState, useEffect, useCallback } from 'react'
import { CONFIG } from '@/constants'

const useBaiduMapLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState(null)

  const loadBaiduMap = useCallback(() => {
    if (window.BMap && window.BMap.Map) {
      setIsLoaded(true)
      return
    }

    const ak = CONFIG.BAIDU_MAP_AK
    if (!ak || ak === 'your_baidu_map_api_key_here') {
      console.warn('百度地图 API Key 未配置，请在 .env 文件中设置 VITE_BAIDU_MAP_AK')
      setLoadError(new Error('百度地图 API Key 未配置'))
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=onBaiduMapLoaded`
    script.async = true
    script.onerror = () => {
      setLoadError(new Error('百度地图 API 加载失败'))
    }

    window.onBaiduMapLoaded = () => {
      const loadLibraries = () => {
        const geoUtilsScript = document.createElement('script')
        geoUtilsScript.src = 'https://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js'
        geoUtilsScript.onload = () => {
          const infoBoxScript = document.createElement('script')
          infoBoxScript.src = 'https://api.map.baidu.com/library/InfoBox/1.2/src/InfoBox_min.js'
          infoBoxScript.onload = () => {
            setIsLoaded(true)
          }
          infoBoxScript.onerror = () => {
            setIsLoaded(true)
          }
          document.head.appendChild(infoBoxScript)
        }
        geoUtilsScript.onerror = () => {
          setIsLoaded(true)
        }
        document.head.appendChild(geoUtilsScript)
      }
      loadLibraries()
    }

    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    loadBaiduMap()
  }, [loadBaiduMap])

  return { isLoaded, loadError }
}

export default useBaiduMapLoader
