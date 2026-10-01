import React, { useCallback, useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';
import dayjs, { type Dayjs } from 'dayjs';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CircularProgress } from '@mui/material';
import { Badge } from '../../../../components/UI/Badge';
import type { WorkerWeeklyHoursResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import {
  Card,
  MainCol,
  LabelRow,
  Label,
  HoursValue,
  BreakdownRow,
  BreakdownDot,
  PayValue,
  WeekRangeRow,
  WeekRangeLabel,
  NavButton,
} from './WeeklyHoursCard.styles';

export interface WeeklyHoursCardProps {
  fetchHours: (date?: string) => Promise<AxiosResponse<WorkerWeeklyHoursResponse>>;
}

const formatRange = (weekStart: string, weekEnd: string) => {
  const start = dayjs(weekStart);
  const end = dayjs(weekEnd);
  const sameMonth = start.month() === end.month() && start.year() === end.year();
  return sameMonth
    ? `${start.format('MMM D')} – ${end.format('D, YYYY')}`
    : `${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`;
};

/**
 * Hours-worked-this-week widget, bound to either the self-service or company-admin
 * weekly-hours endpoint via the fetchHours prop passed in by the parent page.
 */
export const WeeklyHoursCard: React.FC<WeeklyHoursCardProps> = ({ fetchHours }) => {
  const { showError } = useSnackbar();
  const { formatCurrency } = useCurrency();
  const [referenceDate, setReferenceDate] = useState<Dayjs>(() => dayjs());
  const [data, setData] = useState<WorkerWeeklyHoursResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (date: Dayjs) => {
      try {
        setLoading(true);
        const { data: response } = await fetchHours(date.format('YYYY-MM-DD'));
        setData(response);
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to load weekly hours'));
      } finally {
        setLoading(false);
      }
    },
    [fetchHours, showError]
  );

  useEffect(() => {
    load(referenceDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceDate]);

  const totalHours = data ? Number(data.totalHours) : 0;

  return (
    <Card>
      <MainCol>
        <LabelRow>
          <AccessTimeOutlinedIcon fontSize="small" />
          <Label>Hours This Week</Label>
          {data?.hasOpenVisit && (
            <Badge variant="success" size="small">
              On Shift Now
            </Badge>
          )}
        </LabelRow>

        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <>
            <HoursValue>
              {totalHours.toFixed(1)}
              <span>hrs</span>
            </HoursValue>
            {data?.overtimeHours != null && data.overtimeHours > 0 && (
              <BreakdownRow>
                <span>{(data.regularHours ?? 0).toFixed(1)}h regular</span>
                <BreakdownDot>&bull;</BreakdownDot>
                <span>{data.overtimeHours.toFixed(1)}h overtime</span>
                {data.totalPay != null && (
                  <>
                    <BreakdownDot>&bull;</BreakdownDot>
                    <PayValue>{formatCurrency(data.totalPay)}</PayValue>
                  </>
                )}
              </BreakdownRow>
            )}
            {data && (
              <WeekRangeRow>
                <NavButton
                  type="button"
                  aria-label="Previous week"
                  onClick={() => setReferenceDate((d) => d.subtract(7, 'day'))}
                >
                  <ChevronLeftIcon />
                </NavButton>
                <WeekRangeLabel>{formatRange(data.weekStart, data.weekEnd)}</WeekRangeLabel>
                <NavButton
                  type="button"
                  aria-label="Next week"
                  onClick={() => setReferenceDate((d) => d.add(7, 'day'))}
                >
                  <ChevronRightIcon />
                </NavButton>
              </WeekRangeRow>
            )}
          </>
        )}
      </MainCol>
    </Card>
  );
};
