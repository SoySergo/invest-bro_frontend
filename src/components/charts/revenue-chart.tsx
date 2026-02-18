"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface RevenueChartProps {
    data: Array<{ name: string; value: number }>;
    title?: string;
}

export function RevenueChart({ data, title = "Monthly Revenue Trend" }: RevenueChartProps) {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="h-75 mt-6">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">{title}</h4>
            <div className="h-65 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="oklch(0.65 0.20 160)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="oklch(0.65 0.20 160)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                backdropFilter: 'blur(8px)',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="oklch(0.65 0.20 160)"
                            fillOpacity={1}
                            fill="url(#revenueGradient)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
