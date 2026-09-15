import React from 'react';
import { Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { JobStatusData } from '../types';
import * as S from './JobStatusOverviewWidget.styles';

interface JobStatusOverviewWidgetProps {
  data?: JobStatusData[];
  loading?: boolean;
}

const mockStatusData: JobStatusData[] = [
  { name: 'Completed', value: 24, color: '#10B981', percentage: 40 },
  { name: 'In Progress', value: 18, color: '#F97316', percentage: 30 },
  { name: 'Pending', value: 12, color: '#F59E0B', percentage: 20 },
  { name: 'On Hold', value: 6, color: '#EF4444', percentage: 10 },
];

export const JobStatusOverviewWidget: React.FC<JobStatusOverviewWidgetProps> = ({
  data = mockStatusData,
  loading = false,
}) => {
  return (
    <S.Container>
      <S.Header>
        <S.TitleText variant="h6">Job Status Overview</S.TitleText>
      </S.Header>
      <S.ContentWrapper>
        {loading ? (
          <>
            <S.ChartContainer>
              <Skeleton variant="circular" width={140} height={140} animation="wave" />
            </S.ChartContainer>
            <S.LegendContainer>
              {Array.from({ length: 4 }).map((_, index) => (
                <S.LegendItem key={`skeleton-${index}`}>
                  <S.LegendLabel>
                    <Skeleton variant="circular" width={10} height={10} animation="wave" />
                    <Skeleton variant="text" width={60} height={16} animation="wave" />
                  </S.LegendLabel>
                  <Skeleton variant="text" width={40} height={16} animation="wave" />
                </S.LegendItem>
              ))}
            </S.LegendContainer>
          </>
        ) : (
          <>
            <S.ChartContainer>
              <PieChart width={160} height={160}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px',
                    padding: '6px 10px',
                  }}
                  formatter={(value: any, name: any) => [`${value} jobs`, name]}
                />
              </PieChart>
            </S.ChartContainer>
            <S.LegendContainer>
              {data.map((item, index) => (
                <S.LegendItem key={index}>
                  <S.LegendLabel>
                    <S.ColorDot color={item.color} />
                    <S.StatusName variant="body2">{item.name}</S.StatusName>
                  </S.LegendLabel>
                  <S.LegendLabel>
                    <S.StatusValueText variant="body2">{item.value}</S.StatusValueText>
                    <S.StatusPercentage variant="caption">
                      ({item.percentage}%)
                    </S.StatusPercentage>
                  </S.LegendLabel>
                </S.LegendItem>
              ))}
            </S.LegendContainer>
          </>
        )}
      </S.ContentWrapper>
    </S.Container>
  );
};
