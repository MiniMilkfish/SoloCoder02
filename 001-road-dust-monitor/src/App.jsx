import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LargeScreen from './pages/LargeScreen'
import Layout from './components/Layout'
import useBaiduMapLoader from './hooks/useBaiduMapLoader'

function App() {
  const { isLoaded, loadError } = useBaiduMapLoader()

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center panel-border p-8 max-w-md">
          <div className="text-destructive text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-destructive mb-2">百度地图加载失败</h2>
          <p className="text-muted-foreground mb-4">{loadError.message}</p>
          <p className="text-sm text-muted-foreground">
            请在 .env 文件中配置正确的 VITE_BAIDU_MAP_AK 环境变量
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary text-lg glow-text">正在加载百度地图...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/large-screen" element={<LargeScreen />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
