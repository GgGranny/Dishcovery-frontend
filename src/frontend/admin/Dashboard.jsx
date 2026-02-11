import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, 
  Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FiUsers, FiBook, FiMessageSquare, FiStar, 
  FiEye, FiFlag, FiUserPlus, FiRefreshCw, 
  FiTrendingUp, FiChevronRight, FiClock,
  FiCheckCircle, FiAlertCircle, FiChevronDown
} from 'react-icons/fi';
import { HiOutlineChartBar, HiOutlineChartPie } from 'react-icons/hi';

const Dashboard = () => {
  // Stats data with exact values from image
  const stats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+12.5%",
      icon: <FiUsers className="text-2xl" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-gradient-to-br",
      description: "Active platform users",
      trend: "up"
    },
    {
      title: "Total Recipes",
      value: "3,256",
      change: "+8.2%",
      icon: <FiBook className="text-2xl" />,
      color: "from-green-500 to-green-600",
      bgColor: "bg-gradient-to-br",
      description: "Submitted recipes",
      trend: "up"
    },
    {
      title: "Discussions",
      value: "1,429",
      change: "+15.3%",
      icon: <FiMessageSquare className="text-2xl" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-br",
      description: "Community discussions",
      trend: "up"
    },
    {
      title: "Reviews",
      value: "8,934",
      change: "+22.1%",
      icon: <FiStar className="text-2xl" />,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-gradient-to-br",
      description: "Recipe reviews",
      trend: "up"
    }
  ];

  // User Growth Data (exact from image)
  const userGrowthData = [
    { month: 'Jan', users: 1200, target: 1500 },
    { month: 'Feb', users: 1450, target: 1500 },
    { month: 'Mar', users: 1680, target: 1800 },
    { month: 'Apr', users: 1920, target: 2000 },
    { month: 'May', users: 2150, target: 2300 },
    { month: 'Jun', users: 2380, target: 2500 }
  ];

  // Recipe Submissions Data (exact from image)
  const recipeData = [
    { month: 'Jan', recipes: 85, growth: 10 },
    { month: 'Feb', recipes: 92, growth: 8 },
    { month: 'Mar', recipes: 108, growth: 17 },
    { month: 'Apr', recipes: 125, growth: 16 },
    { month: 'May', recipes: 142, growth: 14 },
    { month: 'Jun', recipes: 158, growth: 11 }
  ];
  // Recent Activities (from image)
  const recentActivities = [
    {
      user: "Sarah Chen",
      action: "submitted a new recipe",
      details: "Spicy Thai Green Curry",
      time: "2 minutes ago",
      type: "recipe",
      icon: <FiBook className="text-blue-500" />
    },
    {
      user: "Mike Johnson",
      action: "joined the platform",
      details: "New member registration",
      time: "15 minutes ago",
      type: "user",
      icon: <FiUsers className="text-green-500" />
    },
    {
      user: "Emma Wilson",
      action: "started a discussion",
      details: "Best pasta cooking techniques",
      time: "1 hour ago",
      type: "discussion",
      icon: <FiMessageSquare className="text-purple-500" />
    },
    {
      user: "David Kim",
      action: "updated recipe",
      details: "Korean BBQ Bulgogi",
      time: "2 hours ago",
      type: "recipe",
      icon: <FiBook className="text-blue-500" />
    },
    {
      user: "Lisa Rodriguez",
      action: "left a 5-star review",
      details: "Chocolate Chip Cookies",
      time: "3 hours ago",
      type: "review",
      icon: <FiStar className="text-yellow-500" />
    }
  ];

  // Quick Actions (from image)
  const quickActions = [
    {
      title: "Review Pending Recipes",
      count: 12,
      status: "awaiting approval",
      icon: <FiEye />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      btnColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Moderate Discussions",
      count: 3,
      status: "flagged discussions",
      icon: <FiFlag />,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      btnColor: "bg-red-600 hover:bg-red-700"
    },
    {
      title: "Manage Users",
      count: 8,
      status: "new registrations",
      icon: <FiUserPlus />,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      btnColor: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Featured Content",
      status: "update homepage features",
      icon: <FiRefreshCw />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      btnColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Analytics Report",
      status: "generate weekly report",
      icon: <HiOutlineChartBar />,
      color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      btnColor: "bg-yellow-600 hover:bg-yellow-700"
    }
  ];

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Good morning, Admin</h1>
            <p className="text-gray-600 mt-2 text-lg">Here's what's happening with Dishcovery today</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Last updated: Today, 9:42 AM</span>
            <FiClock className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center text-green-600 font-semibold text-sm">
                      <FiTrendingUp className="mr-1" />
                      {stat.change}
                      <span className="text-gray-500 font-normal ml-2">from last month</span>
                    </div>
                  </div>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl text-white`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">User Growth</h3>
              <p className="text-gray-500 text-sm">Monthly active users growth</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
              View Details <FiChevronRight className="ml-1" />
            </button>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3b82f6" 
                  fill="url(#colorUsers)" 
                  strokeWidth={3}
                  fillOpacity={0.3}
                />
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-500">Total Users (6 months)</span>
                <p className="text-2xl font-bold text-gray-800">10,780</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-green-600 font-semibold">↑ 28.3% growth</span>
                <p className="text-xs text-gray-500">Compared to previous period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Submissions Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Recipe Submissions</h3>
              <p className="text-gray-500 text-sm">New recipes submitted per month</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center">
              View Details <FiChevronRight className="ml-1" />
            </button>
          </div>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recipeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="recipes" 
                  fill="url(#colorRecipes)" 
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
                <defs>
                  <linearGradient id="colorRecipes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-500">Total Recipes (6 months)</span>
                <p className="text-2xl font-bold text-gray-800">710</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-green-600 font-semibold">↑ 18.9% increase</span>
                <p className="text-xs text-gray-500">Compared to previous period</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
              <p className="text-gray-500 text-sm">Latest platform activities</p>
            </div>
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              <FiChevronDown className="inline mr-1" /> Filter
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {activity.icon}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800">{activity.user}</p>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {activity.action} <span className="font-medium">"{activity.details}"</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 text-center text-green-600 hover:text-green-700 font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Load more activities
          </button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
            <p className="text-gray-500 text-sm">Common administrative tasks</p>
          </div>
          
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="group p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm"
              >
                <div className="flex items-start">
                  <div className={`${action.color} p-3 rounded-lg text-white`}>
                    {action.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-semibold text-gray-800">{action.title}</h4>
                    {action.count ? (
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-bold">{action.count}</span> {action.status}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">{action.status}</p>
                    )}
                  </div>
                </div>
                <button className={`w-full mt-3 py-2 text-white rounded-lg font-medium transition-colors ${action.btnColor}`}>
                  Take Action
                </button>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 text-center text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            View All Admin Tools
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">98.7%</div>
            <div className="text-gray-600 mt-2">Uptime</div>
            <div className="text-sm text-green-600 mt-1 flex items-center justify-center">
              <FiCheckCircle className="mr-1" /> Excellent
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">4.7</div>
            <div className="text-gray-600 mt-2">Avg. Rating</div>
            <div className="text-sm text-green-600 mt-1">↑ 0.3 this month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">1.2s</div>
            <div className="text-gray-600 mt-2">Avg. Response Time</div>
            <div className="text-sm text-green-600 mt-1">↓ 0.4s faster</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800">0</div>
            <div className="text-gray-600 mt-2">Critical Issues</div>
            <div className="text-sm text-green-600 mt-1 flex items-center justify-center">
              <FiCheckCircle className="mr-1" /> All systems normal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;