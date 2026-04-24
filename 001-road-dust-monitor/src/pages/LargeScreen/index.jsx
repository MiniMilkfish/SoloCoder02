import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Cloud, Wind, Thermometer, Droplets, CloudRain, MapPin, Activity } from 'lucide-react'
import BaiduMap from '@/components/BaiduMap'
import { LineChart, BarChart, PieChart } from '@/components/Charts'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CONFIG } from '@/constants'
import { 
  mockDeviceList, 
  mockStatistics, 
  generateHourlyDustData, 
  generateDistrictDustData,
  generateDustRankList,
  generateAreaDustDistribution,
  getStatusTextColor,
  MAP_DISPLAY_MODES,
} from '@/data/mockData'

const LargeScreen = () => {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true)
  const [rightPanelVisible, setRightPanelVisible] = useState(true)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [activeDustType, setActiveDustType] = useState('city')
  const [activeRankType, setActiveRankType] = useState('best')
  const [currentZoom, setCurrentZoom] = useState(CONFIG.MAP_ZOOM.DEFAULT)
  const [currentDisplayMode, setCurrentDisplayMode] = useState(MAP_DISPLAY_MODES.CLUSTER)
  
  const [pieData, setPieData] = useState([])
  const [hourlyData, setHourlyData] = useState({ hours: [], values: [] })
  const [districtData, setDistrictData] = useState({ districts: [], values: [] })
  const [areaDustData, setAreaDustData] = useState([])
  const [bestRankList, setBestRankList] = useState([])
  const [worstRankList, setWorstRankList] = useState([])

  useEffect(() => {
    setPieData([
      { name: '优良', value: mockStatistics.excellent },
      { name: '预警', value: mockStatistics.warning },
      { name: '超标', value: mockStatistics.over },
      { name: '断线', value: mockStatistics.offline },
    ])
    setHourlyData(generateHourlyDustData())
    setDistrictData(generateDistrictDustData())
    setAreaDustData(generateAreaDustDistribution())
    setBestRankList(generateDustRankList('ASC'))
    setWorstRankList(generateDustRankList('DESC'))
  }, [])

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setPieData([
        { name: '优良', value: mockStatistics.excellent + Math.floor(Math.random() * 5) - 2 },
        { name: '预警', value: mockStatistics.warning + Math.floor(Math.random() * 3) - 1 },
        { name: '超标', value: mockStatistics.over + Math.floor(Math.random() * 2) },
        { name: '断线', value: mockStatistics.offline + Math.floor(Math.random() * 3) - 1 },
      ])
    }, 8000)

    return () => clearInterval(refreshInterval)
  }, [])

  const handleMarkerClick = (device) => {
    setSelectedDevice(device)
  }

  const handleDisplayModeChange = (mode, zoom) => {
    setCurrentDisplayMode(mode)
    setCurrentZoom(zoom)
  }

  const getDisplayModeText = () => {
    switch (currentDisplayMode) {
      case MAP_DISPLAY_MODES.MASS_POINT: return '海量点模式'
      case MAP_DISPLAY_MODES.CLUSTER: return '聚合点模式'
      case MAP_DISPLAY_MODES.MARKER: return '标注点模式'
      default: return '未知模式'
    }
  }

  const currentRankList = activeRankType === 'best' ? bestRankList : worstRankList

  return (
    <div className="w-full h-full relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 h-16 z-20 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent blur-xl"></div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-96 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <h1 className="relative text-3xl font-bold text-primary tracking-widest" style={{ textShadow: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)' }}>
            杭州市道路环境扬尘在线监测系统数据平台
          </h1>
        </div>
      </div>

      <div className="absolute inset-0">
        <BaiduMap
          devices={mockDeviceList}
          onMarkerClick={handleMarkerClick}
          selectedDevice={selectedDevice}
          onDisplayModeChange={handleDisplayModeChange}
        />
      </div>

      <div
        className={`absolute left-0 top-16 bottom-0 w-80 transition-transform duration-500 ease-out z-10 ${
          leftPanelVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(0, 40, 80, 0.95) 0%, rgba(0, 20, 40, 0.9) 100%)',
          borderRight: '1px solid rgba(0, 212, 255, 0.3)',
        }}
      >
        <div className="p-4 space-y-4 h-full overflow-y-auto">
          <div className="relative p-4 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 40, 80, 0.95) 100%)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Cloud className="w-10 h-10 text-primary" />
                  <Activity className="w-4 h-4 text-green-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">45 优</div>
                  <div className="text-sm text-muted-foreground">多云转晴</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground flex items-center justify-end gap-1">
                  <Thermometer className="w-4 h-4" />
                  25℃ - 32℃
                </div>
                <div className="text-sm text-primary mt-1 font-medium">
                  杭州
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="w-4 h-4" />
                湿度 <Badge variant="outline" className="ml-auto text-primary border-primary/30">65%</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wind className="w-4 h-4" />
                风速 <Badge variant="outline" className="ml-auto text-primary border-primary/30">3级</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>大气压</span>
                <Badge variant="outline" className="ml-auto text-primary border-primary/30">101.3kPa</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CloudRain className="w-4 h-4" />
                降雨量 <Badge variant="outline" className="ml-auto text-primary border-primary/30">0mm</Badge>
              </div>
            </div>
          </div>

          <div className="relative p-4 rounded-lg h-56 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.95) 100%)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-primary/20">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">设备状态统计</h3>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                共 {mockStatistics.total} 台
              </Badge>
            </div>
            <div className="h-36">
              <PieChart
                title=""
                data={pieData}
              />
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-dust-excellent"></span>
                <span className="text-muted-foreground">优良</span>
                <Badge variant="default" className="bg-dust-excellent text-white text-xs px-1.5 py-0">
                  {mockStatistics.excellent}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-dust-warning"></span>
                <span className="text-muted-foreground">预警</span>
                <Badge variant="default" className="bg-dust-warning text-black text-xs px-1.5 py-0">
                  {mockStatistics.warning}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-dust-over"></span>
                <span className="text-muted-foreground">超标</span>
                <Badge variant="default" className="bg-dust-over text-white text-xs px-1.5 py-0">
                  {mockStatistics.over}
                </Badge>
              </div>
            </div>
          </div>

          <div className="relative p-4 rounded-lg h-64 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.95) 100%)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-primary/20">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wider">区域扬尘浓度分布</h3>
            </div>
            <div className="h-44">
              <BarChart
                title=""
                xAxisData={areaDustData.map(d => d.name)}
                seriesData={areaDustData.map(d => d.value.toFixed(3))}
              />
            </div>
          </div>
        </div>

        {leftPanelVisible && (
          <button
            onClick={() => setLeftPanelVisible(false)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-8 h-20 flex items-center justify-center rounded-r-lg transition-colors z-30"
            style={{ background: 'rgba(0, 40, 80, 0.95)', border: '1px solid rgba(0, 212, 255, 0.3)', borderLeft: 0 }}
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>

      {!leftPanelVisible && (
        <button
          onClick={() => setLeftPanelVisible(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-20 flex items-center justify-center rounded-r-lg hover:bg-primary/10 transition-colors"
          style={{ background: 'rgba(0, 40, 80, 0.95)', border: '1px solid rgba(0, 212, 255, 0.3)' }}
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      )}

      <div
        className={`absolute right-0 top-16 bottom-0 w-96 transition-transform duration-500 ease-out z-10 ${
          rightPanelVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(0, 40, 80, 0.95) 0%, rgba(0, 20, 40, 0.9) 100%)',
          borderLeft: '1px solid rgba(0, 212, 255, 0.3)',
        }}
      >
        <div className="p-4 space-y-4 h-full overflow-y-auto">
          <div className="relative p-4 rounded-lg h-56 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.95) 100%)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <div className="flex gap-1 mb-3 pb-2 border-b border-primary/20">
              <button
                onClick={() => setActiveDustType('city')}
                className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  activeDustType === 'city'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                全市扬尘趋势
              </button>
              <button
                onClick={() => setActiveDustType('district')}
                className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  activeDustType === 'district'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                各区县趋势
              </button>
            </div>
            <div className="h-36">
              {activeDustType === 'city' ? (
                <LineChart
                  title=""
                  xAxisData={hourlyData.hours}
                  seriesData={hourlyData.values}
                />
              ) : (
                <BarChart
                  title=""
                  xAxisData={districtData.districts}
                  seriesData={districtData.values}
                />
              )}
            </div>
          </div>

          <div className="relative p-4 rounded-lg h-[calc(100%-240px)] overflow-hidden flex flex-col" style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.95) 100%)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <div className="flex gap-1 mb-3 pb-2 border-b border-primary/20">
              <button
                onClick={() => setActiveRankType('best')}
                className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  activeRankType === 'best'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                最好前十
              </button>
              <button
                onClick={() => setActiveRankType('worst')}
                className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  activeRankType === 'worst'
                    ? 'bg-destructive/20 text-destructive border border-destructive/30'
                    : 'text-muted-foreground hover:text-destructive hover:bg-destructive/5'
                }`}
              >
                最差前十
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10" style={{ background: 'rgba(0, 40, 80, 0.98)' }}>
                  <TableRow className="border-border/20 hover:bg-transparent">
                    <TableHead className="w-12 text-right text-primary">排名</TableHead>
                    <TableHead className="text-primary">站点名称</TableHead>
                    <TableHead className="w-24 text-right text-primary">颗粒物</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRankList.map((item, index) => (
                    <TableRow key={index} className="border-border/10 hover:bg-primary/5">
                      <TableCell className="text-right">
                        {activeRankType === 'best' ? (
                          index < 3 ? (
                            <Badge 
                              variant="default" 
                              className="bg-dust-excellent text-white"
                            >
                              {item.rank}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">{item.rank}</span>
                          )
                        ) : (
                          <Badge 
                            variant="default" 
                            className="bg-destructive text-white"
                          >
                            {item.rank}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[180px] truncate" title={item.projectName}>
                        {item.projectName}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${
                        activeRankType === 'best' ? getStatusTextColor(item.status) : 'text-destructive'
                      }`}>
                        {item.dust}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {rightPanelVisible && (
          <button
            onClick={() => setRightPanelVisible(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-8 h-20 flex items-center justify-center rounded-l-lg transition-colors z-30"
            style={{ background: 'rgba(0, 40, 80, 0.95)', border: '1px solid rgba(0, 212, 255, 0.3)', borderRight: 0 }}
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>

      {!rightPanelVisible && (
        <button
          onClick={() => setRightPanelVisible(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-20 flex items-center justify-center rounded-l-lg hover:bg-primary/10 transition-colors"
          style={{ background: 'rgba(0, 40, 80, 0.95)', border: '1px solid rgba(0, 212, 255, 0.3)' }}
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
      )}

      <div className="absolute top-20 left-4 z-20">
        <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(0, 40, 80, 0.9)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">缩放级别:</span>
            <Badge variant="outline" className="text-primary border-primary/30">{currentZoom}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">显示模式:</span>
            <Badge variant="outline" className="text-primary border-primary/30">{getDisplayModeText()}</Badge>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div 
          className="px-8 py-3 flex items-center gap-8 rounded-lg"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 40, 80, 0.98) 100%)', 
            border: '1px solid rgba(0, 212, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 212, 255, 0.2)'
          }}
        >
          <span className="text-sm text-muted-foreground">
            粉尘浓度 <span className="text-primary font-medium">(mg/m³)</span>
          </span>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 text-xs text-muted-foreground">
              <span>优</span>
              <span>良</span>
              <span className="mr-1">差</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden flex" style={{ width: '180px' }}>
              <div className="flex-1 bg-gradient-to-r from-dust-excellent to-green-400"></div>
              <div className="flex-1 bg-gradient-to-r from-dust-warning to-orange-400"></div>
              <div className="flex-1 bg-gradient-to-r from-dust-over to-red-600"></div>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>0</span>
              <span>0.3</span>
              <span>0.8</span>
              <span>2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LargeScreen
