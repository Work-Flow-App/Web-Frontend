import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Loader } from '../../../components/UI';
import { leaveService, LEAVE_TYPE_OPTIONS } from '../../../services/api';
import type { LeaveCalendarEntry } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import * as S from './LeaveCalendar.styles';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const typeLabel = (value: LeaveCalendarEntry['type']) =>
  LEAVE_TYPE_OPTIONS.find((opt) => opt.value === value)?.label || value;

const buildMonthGrid = (viewMonth: Dayjs): Dayjs[] => {
  const startOfMonth = viewMonth.startOf('month');
  const endOfMonth = viewMonth.endOf('month');
  const gridStart = startOfMonth.subtract(startOfMonth.day(), 'day');
  const gridEnd = endOfMonth.add(6 - endOfMonth.day(), 'day');

  const days: Dayjs[] = [];
  let cursor = gridStart;
  while (cursor.isBefore(gridEnd) || cursor.isSame(gridEnd, 'day')) {
    days.push(cursor);
    cursor = cursor.add(1, 'day');
  }
  return days;
};

export const LeaveCalendar: React.FC = () => {
  const { showError } = useSnackbar();
  const [viewMonth, setViewMonth] = useState(() => dayjs().startOf('month'));
  const [entries, setEntries] = useState<LeaveCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCalendar = useCallback(async () => {
    try {
      setLoading(true);
      const from = viewMonth.startOf('month').format('YYYY-MM-DD');
      const to = viewMonth.endOf('month').format('YYYY-MM-DD');
      const { data } = await leaveService.getLeaveCalendar(from, to);
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load leave calendar'));
    } finally {
      setLoading(false);
    }
  }, [viewMonth, showError]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const days = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  const entriesByDay = useMemo(() => {
    const map = new Map<string, LeaveCalendarEntry[]>();
    days.forEach((day) => {
      const dayEntries = entries.filter(
        (entry) => !day.isBefore(dayjs(entry.startDate), 'day') && !day.isAfter(dayjs(entry.endDate), 'day')
      );
      if (dayEntries.length > 0) map.set(day.format('YYYY-MM-DD'), dayEntries);
    });
    return map;
  }, [days, entries]);

  return (
    <div>
      <S.CalendarHeader>
        <S.NavButton size="small" onClick={() => setViewMonth((m) => m.subtract(1, 'month'))} aria-label="Previous month">
          <ChevronLeftIcon fontSize="small" />
        </S.NavButton>
        <S.MonthLabel variant="subtitle1">{viewMonth.format('MMMM YYYY')}</S.MonthLabel>
        <S.NavButton size="small" onClick={() => setViewMonth((m) => m.add(1, 'month'))} aria-label="Next month">
          <ChevronRightIcon fontSize="small" />
        </S.NavButton>
      </S.CalendarHeader>

      {loading ? (
        <Loader size={20} centered minHeight="200px" />
      ) : (
        <>
          <S.WeekdayRow>
            {WEEKDAY_LABELS.map((label) => (
              <S.WeekdayCell key={label}>{label}</S.WeekdayCell>
            ))}
          </S.WeekdayRow>
          <S.GridContainer>
            {days.map((day) => {
              const isCurrentMonth = day.isSame(viewMonth, 'month');
              const dayEntries = entriesByDay.get(day.format('YYYY-MM-DD')) || [];
              return (
                <S.DayCell key={day.format('YYYY-MM-DD')} isCurrentMonth={isCurrentMonth}>
                  <S.DayNumber isCurrentMonth={isCurrentMonth}>{day.format('D')}</S.DayNumber>
                  {dayEntries.map((entry, idx) => (
                    <S.EntryChip key={`${entry.workerId}-${idx}`} title={`${entry.workerName} — ${typeLabel(entry.type)}`}>
                      {entry.workerName} · {typeLabel(entry.type)}
                    </S.EntryChip>
                  ))}
                </S.DayCell>
              );
            })}
          </S.GridContainer>
        </>
      )}
    </div>
  );
};
