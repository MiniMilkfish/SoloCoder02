import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Cloud, Wind, Thermometer, Droplets, CloudRain } from 'lucide-react'
import BaiduMap from '@/components/BaiduMap'
import { LineChart, BarChart, PieChart } from '@/components/Charts'
import { CONFIG } from '@/constants'
import { 
  mockDeviceList, 
  mockStatistics, 
  generateHourlyDustData, 
  generateDistrictDustData,
  generateDustRankList,
  generateAreaDustDistribution
} from '@/data/mockData'

const LargeScreen = () => {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true)
  const [rightPanelVisible, setRightPanelVisible] = useState(true)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [activeDustType, setActiveDustType] = useState('city')
  const [activeRankType, setActiveRankType] = useState('best')
  
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
        { name: '优良', value: mockStatistics.excellent + Math.floor(Math.random() * 3) - 1 },
        { name: '预警', value: mockStatistics.warning + Math.floor(Math.random() * 2) - 1 },
        { name: '超标', value: mockStatistics.over + Math.floor(Math.random() * 2) },
        { name: '断线', value: mockStatistics.offline + Math.floor(Math.random() * 2) - 1 },
      ])
    }, 10000)

    return () => clearInterval(refreshInterval)
  }, [])

  const handleMarkerClick = (device) => {
    setSelectedDevice(device)
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 h-16 z-20 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-xl"></div>
          <h1 className="relative text-2xl font-bold text-primary glow-text tracking-wider">
            杭州市道路环境扬尘在线监测系统数据平台
          </h1>
        </div>
      </div>

      <div className="absolute inset-0">
        <BaiduMap
          devices={mockDeviceList}
          onMarkerClick={handleMarkerClick}
          selectedDevice={selectedDevice}
        />
      </div>

      <div
        className={`absolute left-0 top-16 bottom-0 w-72 transition-transform duration-500 ease-out z-10 ${
          leftPanelVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(0, 40, 80, 0.9) 0%, rgba(0, 20, 40, 0.85) 100%)',
          borderRight: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        <div className="p-4 space-y-4">
          <div 
            className="panel-border p-4"
            style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.9) 100%)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-primary">45 优</div>
                  <div className="text-sm text-muted-foreground">多云转晴</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  <Thermometer className="inline w-4 h-4 mr-1" />
                  25℃-32℃
                </div>
                <div className="text-sm text-primary mt-1">
                  杭州
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="w-4 h-4" />
                湿度 <span className="text-primary">65%</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wind className="w-4 h-4" />
                风速 <span className="text-primary">3级</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">大气压</span>
                <span className="text-primary">101.3kPa</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CloudRain className="w-4 h-4" />
                降雨量 <span className="text-primary">0mm</span>
              </div>
            </div>
          </div>

          <div 
            className="panel-border p-4 h-52"
            style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.9) 100%)' }}
          >
            <div className="panel-title px-2 py-2 mb-2">设备状态统计</div>
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

          <div 
            className="panel-border p-4 h-64"
            style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.9) 100%)' }}
          >
            <div className="panel-title px-2 py-2 mb-2">区域扬尘浓度分布</div>
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
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-8 h-20 flex items-center justify-center bg-background-panel border border-l-0 border-border/30 rounded-r-lg hover:bg-primary/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>

      {!leftPanelVisible && (
        <button
          onClick={() => setLeftPanelVisible(true)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-20 flex items-center justify-center bg-background-panel border border-border/30 rounded-r-lg hover:bg-primary/20 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      )}

      <div
        className={`absolute right-0 top-16 bottom-0 w-80 transition-transform duration-500 ease-out z-10 ${
          rightPanelVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(0, 40, 80, 0.9) 0%, rgba(0, 20, 40, 0.85) 100%)',
          borderLeft: '1px solid rgba(0, 212, 255, 0.2)',
        }}
      >
        <div className="p-4 space-y-4">
          <div 
            className="panel-border p-4 h-56"
            style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.9) 100%)' }}
          >
            <div className="flex gap-1 mb-3">
              <button
                onClick={() => setActiveDustType('city')}
                className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  activeDustType === 'city'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                全市扬尘趋势
              </button>
              <button
                onClick={() => setActiveDustType('district')}
                className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  activeDustType === 'district'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                各区县趋势
              </button>
            </div>
            <div className="h-40">
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

          <div 
            className="panel-border p-4 h-72"
            style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 40, 80, 0.9) 100%)' }}
          >
            <div className="flex gap-1 mb-3">
              <button
                onClick={() => setActiveRankType('best')}
                className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  activeRankType === 'best'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                最好前十
              </button>
              <button
                onClick={() => setActiveRankType('worst')}
                className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  activeRankType === 'worst'
                    ? 'bg-destructive/20 text-destructive border border-destructive/30'
                    : 'text-muted-foreground hover:text-destructive'
                }`}
              >
                最差前十
              </button>
            </div>
            <div className="h-52 overflow-y-auto scrollbar-hide">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground text-xs sticky top-0 bg-background-panel">
                  <tr>
                    <th className="text-right p-2 w-8">排名</th>
                    <th className="text-left p-2">站点名称</th>
                    <th className="text-right p-2 w-20">颗粒物</th>
                    <th className="text-left p-2 w-16">区县</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeRankType === 'best' ? bestRankList : worstRankList).map((item, index) => (
                    <tr key={index} className="border-t border-border/20 hover:bg-white/5">
                      <td className="text-right p-2">
                        {activeRankType === 'best' ? (
                          index < 3 ? (
                            <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                              {item.rank}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">{item.rank}</span>
                          )
                        ) : (
                          <span className="text-destructive font-bold">{item.rank}</span>
                        )}
                      </td>
                      <td className="p-2 truncate max-w-32" title={item.projectName}>
                        {item.projectName}
                      </td>
                      <td className={`text-right p-2 font-bold ${
                        activeRankType === 'best' ? 'text-primary' : 'text-destructive'
                      }`}>
                        {item.dust}
                      </td>
                      <td className="p-2 text-muted-foreground text-xs">
                        {item.districtName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {rightPanelVisible && (
          <button
            onClick={() => setRightPanelVisible(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-8 h-20 flex items-center justify-center bg-background-panel border border-r-0 border-border/30 rounded-l-lg hover:bg-primary/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>

      {!rightPanelVisible && (
        <button
          onClick={() => setRightPanelVisible(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-20 flex items-center justify-center bg-background-panel border border-border/30 rounded-l-lg hover:bg-primary/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div 
          className="panel-border px-6 py-2 flex items-center gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 40, 80, 0.95) 100%)' }}
        >
          <span className="text-sm text-muted-foreground">粉尘 <s className="text-primary">mg/m³</s></span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 text-xs text-muted-foreground">
              <span>好</span>
              <span>中</span>
              <span className="mr-2">差</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden flex">
              <div className="w-16 bg-gradient-to-r from-green-500 to-green-400"></div>
              <div className="w-16 bg-gradient-to-r from-yellow-500 to-orange-400"></div>
              <div className="w-16 bg-gradient-to-r from-red-500 to-red-600"></div>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>0</span>
              <span>0.3</span>
              <span>0.8</span>
              <span>2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LargeScreen
