"use client";

import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartDatum = {
  month: string;
  requisition: number;
  supply: number;
};

const chartConfig = {
  desktop: {
    label: "Requisition",
    color: "#2563eb",
  },
  mobile: {
    label: "Supply",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function ChartComponent({ chartData }: { chartData: ChartDatum[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="requisition" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="supply" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
