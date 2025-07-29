"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Bell, 
  Settings, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Activity, 
  Users,
  Calendar,
  Filter,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const stats = [
    {
      title: "Total Balance",
      value: "$18,248.44",
      change: "+2.5%",
      trend: "up",
      icon: DollarSign,
      description: "Available for use"
    },
    {
      title: "Total Expenses",
      value: "$72,421.84",
      change: "-8% vs prev year",
      trend: "down",
      icon: CreditCard,
      description: "This month"
    },
    {
      title: "Total Income",
      value: "$98,248.44",
      change: "+14% vs prev year",
      trend: "up",
      icon: TrendingUp,
      description: "This month"
    },
    {
      title: "Active Reservations",
      value: "24",
      change: "+3 this week",
      trend: "up",
      icon: Calendar,
      description: "Current bookings"
    }
  ];

  const transactions = [
    {
      id: 1,
      name: "Segment LLC",
      email: "segment@company.com",
      type: "Received",
      amount: "+$500.00",
      date: "29 July 2024, 16:48",
      status: "completed",
      avatar: "S"
    },
    {
      id: 2,
      name: "Ken Rasmussen",
      email: "ken@company.com",
      type: "Sent",
      amount: "-$200.00",
      date: "21 July 2024, 10:20",
      status: "completed",
      avatar: "K"
    },
    {
      id: 3,
      name: "FoodShot",
      email: "food@shot.com",
      type: "Payment",
      amount: "-$25.00",
      date: "21 July 2024, 11:38",
      status: "pending",
      avatar: "F"
    },
    {
      id: 4,
      name: "Needy Craig",
      email: "needy@craig.com",
      type: "Received",
      amount: "+$500.00",
      date: "21 July 2024, 10:20",
      status: "completed",
      avatar: "N"
    },
    {
      id: 5,
      name: "Lucy Jones",
      email: "lucy@jones.com",
      type: "Received",
      amount: "+$200.00",
      date: "20 July 2024, 16:43",
      status: "completed",
      avatar: "L"
    }
  ];

  const recentContacts = [
    { name: "Alice Johnson", avatar: "A", status: "online" },
    { name: "Bob Smith", avatar: "B", status: "offline" },
    { name: "Carol Davis", avatar: "C", status: "online" },
    { name: "David Wilson", avatar: "D", status: "away" },
    { name: "Emma Brown", avatar: "E", status: "online" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LR</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Lazy Reserve</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 w-80 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">RD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen p-6">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-700">
              <Activity className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <CreditCard className="mr-3 h-4 w-4" />
              Cards
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-3 h-4 w-4" />
              Receipts
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-3 h-4 w-4" />
              Manage
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-3 h-4 w-4" />
              History
            </Button>
          </nav>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700">Recent Contacts</h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentContacts.map((contact, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                      contact.status === 'online' ? 'bg-green-500' :
                      contact.status === 'away' ? 'bg-yellow-500' : 'bg-slate-300'
                    }`}></div>
                  </div>
                  <span className="text-sm text-slate-700">{contact.name}</span>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add new
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-slate-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="flex items-center space-x-1 text-xs text-slate-600 mt-1">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
                      <CardDescription>You can view your transaction history</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                              {transaction.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{transaction.name}</p>
                            <p className="text-sm text-slate-500">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                            className={transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                          >
                            {transaction.type}
                          </Badge>
                          <span className={`font-medium ${
                            transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount}
                          </span>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" className="w-full">
                      View all transactions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Exchange & Quick Actions */}
            <div className="space-y-6">
              {/* Exchange Card */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Exchange</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">$</span>
                      </div>
                      <span className="font-medium">USD</span>
                    </div>
                    <span className="font-bold">300</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">€</span>
                      </div>
                      <span className="font-medium">EUR</span>
                    </div>
                    <span className="font-bold">275.68</span>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    USD-USD • 0.92 Euro • Exchange Fee: $15.24
                  </div>
                  
                  <Button className="w-full bg-slate-900 hover:bg-slate-800">
                    Exchange
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Send Money
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Request Money
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Card
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    New Reservation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}