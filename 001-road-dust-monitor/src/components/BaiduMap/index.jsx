import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { CONFIG, MAP_STYLE } from '@/constants'
import { getStatusColor, MAP_DISPLAY_MODES, getMapDisplayModeByZoom } from '@/data/mockData'

const BaiduMap = ({ 
  devices = [], 
  onMarkerClick, 
  selectedDevice,
  mapStyle: customMapStyle,
  onDisplayModeChange,
}) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const pointCollectionsRef = useRef([])
  const infoWindowRef = useRef(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(CONFIG.MAP_ZOOM.DEFAULT)
  const [currentDisplayMode, setCurrentDisplayMode] = useState(MAP_DISPLAY_MODES.CLUSTER)

  const devicesByStatus = useMemo(() => {
    const result = {
      [CONFIG.STATUS.EXCELLENT]: [],
      [CONFIG.STATUS.WARNING]: [],
      [CONFIG.STATUS.OVER]: [],
      [CONFIG.STATUS.OFFLINE]: [],
    }
    devices.forEach(device => {
      if (device.longitude && device.latitude) {
        result[device.status]?.push(device)
      }
    })
    return result
  }, [devices])

  const createMarkerIcon = useCallback((status, isSelected = false) => {
    const color = getStatusColor(status)
    const size = isSelected ? 40 : 30
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.5)'
    ctx.lineWidth = isSelected ? 3 : 2
    ctx.stroke()
    
    if (isSelected) {
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 + 3, 0, Math.PI * 2)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
    }

    return canvas.toDataURL()
  }, [])

  const createInfoWindow = useCallback((device) => {
    const statusLabel = CONFIG.STATUS_LABELS[device.status]
    const statusColor = getStatusColor(device.status)
    
    const content = `
      <div style="min-width: 280px; padding: 16px; font-family: 'Microsoft YaHei', sans-serif;">
        <div style="border-bottom: 1px solid rgba(0,212,255,0.3); padding-bottom: 10px; margin-bottom: 12px;">
          <h3 style="margin: 0; font-size: 16px; color: #00d4ff; font-weight: bold;">
            ${device.projectName}
          </h3>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
          <div style="color: #888;">MN编码:</div>
          <div style="color: #fff;">${device.mnCode}</div>
          
          <div style="color: #888;">设备状态:</div>
          <div>
            <span style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              background: ${statusColor};
              color: ${device.status === CONFIG.STATUS.WARNING ? '#000' : '#fff'};
              font-weight: bold;
            ">
              ${statusLabel}
            </span>
          </div>
          
          <div style="color: #888;">颗粒物浓度:</div>
          <div style="color: #fff; font-weight: bold;">
            ${device.dust.toFixed(3)} mg/m³
          </div>
          
          <div style="color: #888;">PM2.5:</div>
          <div style="color: #fff;">${device.pm25.toFixed(3)} mg/m³</div>
          
          <div style="color: #888;">所在区县:</div>
          <div style="color: #fff;">${device.districtName}</div>
          
          <div style="color: #888;">项目地址:</div>
          <div style="color: #fff; grid-column: span 2;">${device.projectAddress}</div>
          
          <div style="color: #888;">数据时间:</div>
          <div style="color: #fff; grid-column: span 2;">${device.dataTime}</div>
        </div>
      </div>
    `
    
    return content
  }, [])

  const clearAllOverlays = useCallback(() => {
    const map = mapInstanceRef.current
    if (!map) return

    markersRef.current.forEach(marker => map.removeOverlay(marker))
    markersRef.current = []

    pointCollectionsRef.current.forEach(collection => map.removeOverlay(collection))
    pointCollectionsRef.current = []
  }, [])

  const renderMassPoints = useCallback(() => {
    const BMap = window.BMap
    const map = mapInstanceRef.current
    if (!BMap || !map) return

    clearAllOverlays()

    const statusConfigs = [
      { status: CONFIG.STATUS.EXCELLENT, color: getStatusColor(CONFIG.STATUS.EXCELLENT) },
      { status: CONFIG.STATUS.WARNING, color: getStatusColor(CONFIG.STATUS.WARNING) },
      { status: CONFIG.STATUS.OVER, color: getStatusColor(CONFIG.STATUS.OVER) },
      { status: CONFIG.STATUS.OFFLINE, color: getStatusColor(CONFIG.STATUS.OFFLINE) },
    ]

    statusConfigs.forEach(({ status, color }) => {
      const statusDevices = devicesByStatus[status]
      if (statusDevices.length === 0) return

      const points = statusDevices.map(device => 
        new BMap.Point(device.longitude, device.latitude)
      )

      const options = {
        size: window.BMAP_POINT_SIZE_SMALL,
        shape: window.BMAP_POINT_SHAPE_CIRCLE,
        color: color,
      }

      try {
        const pointCollection = new BMap.PointCollection(points, options)
        map.addOverlay(pointCollection)
        pointCollectionsRef.current.push(pointCollection)
      } catch (e) {
        console.warn('PointCollection 不支持，使用简化方式:', e)
      }
    })
  }, [devicesByStatus, clearAllOverlays])

  const renderClusteredMarkers = useCallback(() => {
    const BMap = window.BMap
    const map = mapInstanceRef.current
    if (!BMap || !map) return

    clearAllOverlays()

    const bounds = map.getBounds()
    if (!bounds) return

    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()

    const visibleDevices = devices.filter(device => {
      if (!device.longitude || !device.latitude) return false
      return device.longitude >= sw.lng && device.longitude <= ne.lng &&
             device.latitude >= sw.lat && device.latitude <= ne.lat
    })

    const limitedDevices = visibleDevices.slice(0, 200)

    limitedDevices.forEach(device => {
      const point = new BMap.Point(device.longitude, device.latitude)
      const isSelected = selectedDevice?.devicePoleId === device.devicePoleId
      const iconUrl = createMarkerIcon(device.status, isSelected)

      const myIcon = new BMap.Icon(
        iconUrl,
        new BMap.Size(isSelected ? 40 : 30, isSelected ? 40 : 30),
        {
          anchor: new BMap.Size(isSelected ? 20 : 15, isSelected ? 20 : 15),
        }
      )

      const marker = new BMap.Marker(point, { icon: myIcon })
      marker.device = device
      map.addOverlay(marker)
      markersRef.current.push(marker)

      marker.addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(device)
        }

        if (infoWindowRef.current) {
          map.closeInfoWindow()
        }

        const infoWindow = new BMap.InfoWindow(createInfoWindow(device))
        infoWindowRef.current = infoWindow
        map.openInfoWindow(infoWindow, point)
      })
    })
  }, [devices, selectedDevice, createMarkerIcon, createInfoWindow, onMarkerClick, clearAllOverlays])

  const renderDetailedMarkers = useCallback(() => {
    const BMap = window.BMap
    const map = mapInstanceRef.current
    if (!BMap || !map) return

    clearAllOverlays()

    devices.forEach(device => {
      if (!device.longitude || !device.latitude) return

      const point = new BMap.Point(device.longitude, device.latitude)
      const isSelected = selectedDevice?.devicePoleId === device.devicePoleId
      const iconUrl = createMarkerIcon(device.status, isSelected)

      const myIcon = new BMap.Icon(
        iconUrl,
        new BMap.Size(isSelected ? 40 : 30, isSelected ? 40 : 30),
        {
          anchor: new BMap.Size(isSelected ? 20 : 15, isSelected ? 20 : 15),
        }
      )

      const marker = new BMap.Marker(point, { icon: myIcon })
      marker.device = device
      map.addOverlay(marker)
      markersRef.current.push(marker)

      marker.addEventListener('click', () => {
        if (onMarkerClick) {
          onMarkerClick(device)
        }

        if (infoWindowRef.current) {
          map.closeInfoWindow()
        }

        const infoWindow = new BMap.InfoWindow(createInfoWindow(device))
        infoWindowRef.current = infoWindow
        map.openInfoWindow(infoWindow, point)
      })
    })

    if (selectedDevice && selectedDevice.longitude && selectedDevice.latitude) {
      const point = new BMap.Point(selectedDevice.longitude, selectedDevice.latitude)
      map.panTo(point)
    }
  }, [devices, selectedDevice, createMarkerIcon, createInfoWindow, onMarkerClick, clearAllOverlays])

  const renderByDisplayMode = useCallback(() => {
    const displayMode = getMapDisplayModeByZoom(currentZoom)
    setCurrentDisplayMode(displayMode)

    if (onDisplayModeChange) {
      onDisplayModeChange(displayMode, currentZoom)
    }

    switch (displayMode) {
      case MAP_DISPLAY_MODES.MASS_POINT:
        renderMassPoints()
        break
      case MAP_DISPLAY_MODES.CLUSTER:
        renderClusteredMarkers()
        break
      case MAP_DISPLAY_MODES.MARKER:
        renderDetailedMarkers()
        break
      default:
        renderClusteredMarkers()
    }
  }, [currentZoom, renderMassPoints, renderClusteredMarkers, renderDetailedMarkers, onDisplayModeChange])

  const handleZoomEnd = useCallback(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const newZoom = map.getZoom()
    setCurrentZoom(newZoom)
  }, [])

  const handleMoveEnd = useCallback(() => {
    const displayMode = getMapDisplayModeByZoom(currentZoom)
    if (displayMode === MAP_DISPLAY_MODES.CLUSTER) {
      renderClusteredMarkers()
    }
  }, [currentZoom, renderClusteredMarkers])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const initMap = () => {
      const BMap = window.BMap
      const map = new BMap.Map(mapRef.current, {
        enableMapClick: false,
        maxZoom: CONFIG.MAP_ZOOM.MAX,
        minZoom: CONFIG.MAP_ZOOM.MIN,
      })

      const point = new BMap.Point(
        CONFIG.HANGZHOU_COORDINATE.lng,
        CONFIG.HANGZHOU_COORDINATE.lat
      )

      map.centerAndZoom(point, CONFIG.MAP_ZOOM.DEFAULT)
      map.enableScrollWheelZoom(true)

      try {
        map.setMapStyleV2({ styleJson: customMapStyle || MAP_STYLE })
      } catch (e) {
        console.log('设置地图样式失败:', e)
      }

      map.addEventListener('zoomend', handleZoomEnd)
      map.addEventListener('moveend', handleMoveEnd)

      mapInstanceRef.current = map
      setCurrentZoom(map.getZoom())
      setIsMapReady(true)
    }

    if (window.BMap && window.BMap.Map) {
      initMap()
    } else {
      const checkInterval = setInterval(() => {
        if (window.BMap && window.BMap.Map) {
          clearInterval(checkInterval)
          initMap()
        }
      }, 100)

      return () => clearInterval(checkInterval)
    }

    return () => {
      const map = mapInstanceRef.current
      if (map) {
        map.removeEventListener('zoomend', handleZoomEnd)
        map.removeEventListener('moveend', handleMoveEnd)
      }
    }
  }, [customMapStyle, handleZoomEnd, handleMoveEnd])

  useEffect(() => {
    if (!isMapReady) return
    renderByDisplayMode()
  }, [isMapReady, renderByDisplayMode])

  useEffect(() => {
    if (!isMapReady) return
    
    const displayMode = getMapDisplayModeByZoom(currentZoom)
    if (displayMode === MAP_DISPLAY_MODES.MARKER) {
      renderDetailedMarkers()
    }
  }, [isMapReady, selectedDevice, currentZoom, renderDetailedMarkers])

  const getDisplayModeLabel = () => {
    switch (currentDisplayMode) {
      case MAP_DISPLAY_MODES.MASS_POINT:
        return '海量点模式'
      case MAP_DISPLAY_MODES.CLUSTER:
        return '聚合点模式'
      case MAP_DISPLAY_MODES.MARKER:
        return '标注点模式'
      default:
        return '未知模式'
    }
  }

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {isMapReady && (
        <div className="absolute bottom-4 left-4 bg-background-panel/90 border border-border/30 rounded-lg px-3 py-2 text-xs">
          <span className="text-muted-foreground">缩放级别: </span>
          <span className="text-primary font-bold">{currentZoom}</span>
          <span className="text-muted-foreground mx-2">|</span>
          <span className="text-muted-foreground">显示模式: </span>
          <span className="text-primary font-bold">{getDisplayModeLabel()}</span>
        </div>
      )}
      
      {isMapReady && (
        <div className="absolute top-4 right-4 bg-background-panel/90 border border-border/30 rounded-lg px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-dust-excellent"></span>
              <span className="text-muted-foreground">优良</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-dust-warning"></span>
              <span className="text-muted-foreground">预警</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-dust-over"></span>
              <span className="text-muted-foreground">超标</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-dust-offline"></span>
              <span className="text-muted-foreground">断线</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BaiduMap
