import React, { useEffect, useState } from 'react';
import { CircularProgress, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { workerService, jobService } from '../../services/api';
import type { JobResponse } from '../../services/api';
import {
  PageContainer,
  DashboardHeader,
  DashboardGrid,
  StatCard,
  StatValue,
  StatLabel,
  LoadingContainer,
  Title,
  ChartsContainer,
  ChartCard,
  ChartTitle,
} from './CompanyPage.styles';

interface JobStatusData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export const CompanyPage: React.FC = () => {
  const theme = useTheme();
  const [workerCount, setWorkerCount] = useState<number>(0);
  const [jobCount, setJobCount] = useState<number>(0);
  const [jobStatusData, setJobStatusData] = useState<JobStatusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Color palette for charts using theme colors
  const CHART_COLORS = [
    theme.palette.colors.chart_primary,
    theme.palette.colors.chart_secondary,
    theme.palette.colors.chart_tertiary,
    theme.palette.colors.chart_quaternary,
    theme.palette.colors.chart_quinary,
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [workersResponse, jobsResponse] = await Promise.all([
          workerService.getAllWorkers(),
          jobService.getAllJobs(),
        ]);

        const workersData = Array.isArray(workersResponse.data) ? workersResponse.data : [];
        const jobsData: JobResponse[] = Array.isArray(jobsResponse.data) ? jobsResponse.data : [];

        setWorkerCount(workersData.length);
        setJobCount(jobsData.length);

        // Calculate job status distribution
        const statusCounts: Record<string, number> = {};
        jobsData.forEach((job) => {
          const status = job.status || 'Unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusData: JobStatusData[] = Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value,
        }));

        setJobStatusData(statusData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setWorkerCount(0);
        setJobCount(0);
        setJobStatusData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const overviewData = [
    { name: 'Workers', value: workerCount },
    { name: 'Jobs', value: jobCount },
  ];

  return (
    <PageContainer>
      <DashboardHeader>
        <Title>Company Dashboard</Title>
      </DashboardHeader>

      {loading ? (
        <LoadingContainer>
          <CircularProgress size={40} />
        </LoadingContainer>
      ) : (
        <>
          <DashboardGrid>
            <StatCard>
              <StatValue>{workerCount}</StatValue>
              <StatLabel>Total Workers</StatLabel>
            </StatCard>

            <StatCard>
              <StatValue>{jobCount}</StatValue>
              <StatLabel>Total Jobs</StatLabel>
            </StatCard>
          </DashboardGrid>

          <ChartsContainer>
            <ChartCard>
              <ChartTitle>Job Status Distribution</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobStatusData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard>
              <ChartTitle>Workers vs Jobs Overview</ChartTitle>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.colors.grey_200} />
                  <XAxis dataKey="name" stroke={theme.palette.colors.grey_600} />
                  <YAxis stroke={theme.palette.colors.grey_600} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </ChartsContainer>
        </>
      )}
    </PageContainer>
  );
};
