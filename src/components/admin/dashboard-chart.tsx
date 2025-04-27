"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

interface UserSignupData {
  date: string;
  count: number;
}

interface PurchaseData {
  date: string;
  count: number;
}

interface RoleData {
  name: string;
  value: number;
  color: string;
}

interface ChartData {
  userSignups: UserSignupData[];
  purchases: PurchaseData[];
  roleData: RoleData[];
}

function getMonthData(data: any[], days: number = 30) {
  const result: any[] = [];
  const today = new Date();
  
  // Create an array of the last 'days' days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Find if we have data for this date
    const entry = data.find(item => item.date === dateString);
    
    result.push({
      date: dateString,
      count: entry ? entry.count : 0
    });
  }
  
  return result;
}

export default function DashboardChart({ data }: { data: ChartData }) {
  const [timeframe, setTimeframe] = useState<"7days" | "30days">("30days");
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");
  
  const days = timeframe === "7days" ? 7 : 30;
  const userSignupsData = getMonthData(data.userSignups, days);
  const purchasesData = getMonthData(data.purchases, days);
  
  const combinedData = userSignupsData.map((item, index) => ({
    date: item.date,
    "User Signups": item.count,
    "Course Purchases": purchasesData[index]?.count || 0
  }));
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Analytics</CardTitle>
          <div className="flex items-center gap-2">
            <div>
              <TabsList>
                <TabsTrigger 
                  value="7days" 
                  onClick={() => setTimeframe("7days")} 
                  className={timeframe === "7days" ? "bg-primary text-primary-foreground" : ""}
                >
                  7 Days
                </TabsTrigger>
                <TabsTrigger 
                  value="30days" 
                  onClick={() => setTimeframe("30days")}
                  className={timeframe === "30days" ? "bg-primary text-primary-foreground" : ""}
                >
                  30 Days
                </TabsTrigger>
              </TabsList>
            </div>
            <div>
              <TabsList>
                <TabsTrigger 
                  value="area" 
                  onClick={() => setChartType("area")}
                  className={chartType === "area" ? "bg-primary text-primary-foreground" : ""}
                >
                  Area
                </TabsTrigger>
                <TabsTrigger 
                  value="line" 
                  onClick={() => setChartType("line")}
                  className={chartType === "line" ? "bg-primary text-primary-foreground" : ""}
                >
                  Line
                </TabsTrigger>
                <TabsTrigger 
                  value="bar" 
                  onClick={() => setChartType("bar")}
                  className={chartType === "bar" ? "bg-primary text-primary-foreground" : ""}
                >
                  Bar
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>
        <CardDescription>
          User registrations and course purchases over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={combinedData}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis allowDecimals={false} />
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <Tooltip 
                  formatter={(value: number) => [value, ""]}
                  labelFormatter={(label: string) => {
                    const date = new Date(label);
                    return date.toLocaleDateString();
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="User Signups" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorSignups)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="Course Purchases" 
                  stroke="hsl(var(--success))" 
                  fillOpacity={1} 
                  fill="url(#colorPurchases)" 
                />
                <Legend />
              </AreaChart>
            ) : chartType === "line" ? (
              <LineChart data={combinedData}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis allowDecimals={false} />
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <Tooltip 
                  formatter={(value: number) => [value, ""]}
                  labelFormatter={(label: string) => {
                    const date = new Date(label);
                    return date.toLocaleDateString();
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="User Signups" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Course Purchases" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Legend />
              </LineChart>
            ) : (
              <BarChart data={combinedData}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis allowDecimals={false} />
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <Tooltip 
                  formatter={(value: number) => [value, ""]}
                  labelFormatter={(label: string) => {
                    const date = new Date(label);
                    return date.toLocaleDateString();
                  }}
                />
                <Bar dataKey="User Signups" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Course Purchases" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                <Legend />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">User Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.roleData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }: { name: string; percent: number }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {data.roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {combinedData.slice(-5).map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{day["User Signups"]} new users</span>
                      {day["Course Purchases"] > 0 && (
                        <span className="ml-2 text-success">
                          {day["Course Purchases"]} {day["Course Purchases"] === 1 ? 'purchase' : 'purchases'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 