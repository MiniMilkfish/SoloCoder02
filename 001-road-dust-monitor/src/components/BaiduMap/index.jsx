import { useEffect, useRef, useState, useCallback } from 'react'
import { CONFIG, MAP_STYLE } from '@/constants'

const BaiduMap = ({ 
  devices = [], 
  onMarkerClick, 
  selectedDevice,
  mapStyle: customMapStyle 
}) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const infoWindowRef = useRef(null)
  const [isMapReady, setIsMapReady] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case CONFIG.STATUS.EXCELLENT:
        return '#28A33E'
      case CONFIG.STATUS.WARNING:
        return '#FBAA22'
      case CONFIG.STATUS.OVER:
        return '#F92424'
      case CONFIG.STATUS.OFFLINE:
        return '#2C2C2C'
      default:
        return '#28A33E'
    }
  }

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

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

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

    function initMap() {
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

      mapInstanceRef.current = map
      setIsMapReady(true)
    }
  }, [customMapStyle])

  useEffect(() => {
    if (!isMapReady || !mapInstanceRef.current) return

    const BMap = window.BMap
    const map = mapInstanceRef.current

    markersRef.current.forEach(marker => map.removeOverlay(marker))
    markersRef.current = []

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
  }, [devices, selectedDevice, isMapReady, createMarkerIcon, createInfoWindow, onMarkerClick])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  )
}

export default BaiduMap
