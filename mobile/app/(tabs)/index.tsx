import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { cn } from '@/src/utils'; // Assumes you copied utils layer

const Card = ({ children }: { children: React.ReactNode }) => (
  <View className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm mb-4">
    {children}
  </View>
);

export default function HomeScreen() {
  const highlights = [
    { title: 'Smart Insights', desc: 'Visualize your wealth with real-time analytics and intuitive spending charts.', icon: '📊' },
    { title: 'Secure Vault', desc: 'Industry-leading encryption ensures your financial data stays private.', icon: '🔐' },
    { title: 'Cloud Sync', desc: 'Your money, everywhere. Sync your data across all your devices instantly.', icon: '☁️' }
  ];

  const features = [
    { title: 'Financial Dashboard', desc: 'Track Total Balance, Monthly Income, and Expenses in real-time.', icon: '🏠' },
    { title: 'Account Management', desc: 'Manage Savings, Cash, and Credit Cards in a single unified view.', icon: '💳' },
    { title: 'Investment Portfolio', desc: 'Track Mutual Funds, Stocks, and FDs with premium valuation updates.', icon: '🏦' },
    { title: 'Loan & Debt Tracking', desc: 'Manage mortgages, personal loans, and settlements with ease.', icon: '💰' },
    { title: 'Monthly Reports', desc: 'Detailed spending breakdowns and automated category analytics.', icon: '📊' },
    { title: 'Data Export', desc: 'Professional data reporting for external analysis with one click.', icon: '📋' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <ScrollView className="flex-1 px-6">
        <View className="py-10 items-center">
          <Text className="text-4xl font-extrabold text-neutral-900 dark:text-white text-center mb-4 tracking-tight">
            Master Your <Text className="text-indigo-500">Finances</Text> Today
          </Text>
          <Text className="text-neutral-600 dark:text-neutral-400 text-lg text-center mb-10 leading-relaxed font-medium">
            Your personal finance manager. Track expenses, manage budgets, and achieve your financial goals with ease.
          </Text>

          {/* Highlights */}
          <View className="w-full mb-8">
            {highlights.map((feature, i) => (
              <Card key={i}>
                <Text className="text-3xl mb-3">{feature.icon}</Text>
                <Text className="text-xl font-bold mb-2 text-neutral-800 dark:text-white">{feature.title}</Text>
                <Text className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.desc}</Text>
              </Card>
            ))}
          </View>

          {/* Detailed Features */}
          <View className="w-full pt-8 border-t border-neutral-100 dark:border-neutral-800">
            <Text className="text-2xl font-black mb-8 text-neutral-900 dark:text-white text-center">
              Everything you need to <Text className="text-indigo-600 dark:text-indigo-400">succeed</Text>
            </Text>

            <View className="space-y-6">
              {features.map((item, i) => (
                <View key={i} className="flex-row items-center space-x-4 mb-6">
                  <View className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 items-center justify-center">
                    <Text className="text-xl">{item.icon}</Text>
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="font-bold text-neutral-900 dark:text-white mb-1">{item.title}</Text>
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
