/**
 * EdgeOne 部署配置文件
 * 用于配置腾讯云 EdgeOne 静态网站托管
 */

module.exports = {
  // 网站根目录，默认为构建输出目录
  root: 'dist',
  
  // 入口文件
  entry: 'index.html',
  
  // 构建命令
  buildCommand: 'npm run build',
  
  // 输出目录
  outputDir: 'dist',
  
  // 路由配置
  routes: [
    {
      // 匹配所有路径
      src: '/(.*)',
      // 重写到 index.html
      dest: '/index.html',
      // 设置响应头
      headers: {
        'Cache-Control': 'public, max-age=3600'
      }
    }
  ],
  
  // 环境变量（可选）
  env: {
    NODE_ENV: 'production'
  },
  
  // 缓存配置
  cache: {
    // 静态资源缓存时间（秒）
    staticMaxAge: 31536000, // 1年
    // HTML 文件缓存时间（秒）
    htmlMaxAge: 3600 // 1小时
  }
};