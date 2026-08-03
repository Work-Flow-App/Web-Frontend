import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Popover } from '@mui/material';
import dayjs, { type Dayjs } from 'dayjs';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Loader } from '../../../components/UI';
import { StandaloneDropdown } from '../../../components/UI/Forms/Dropdown';
import { leaveService, LeaveType, LEAVE_TYPE_OPTIONS } from '../../../services/api';
import type { LeaveCalendarEntry } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { LEAVE_TYPE_COLOR_KEY } from './LeaveCalendar.colors';
import * as S from './LeaveCalendar.styles';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_PER_DAY = 3;

const TYPE_FILTER_OPTIONS = [{ value: 'ALL', label: 'All types' }, ...LEAVE_TYPE_OPTIONS];

const typeLabel = (value: LeaveCalendarEntry['leaveType']) =>
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

interface DayPopoverState {
  anchorEl: HTMLElement;
  date: string;
  entries: LeaveCalendarEntry[];
}

export const LeaveCalendar: React.FC = () => {
  const { showError } = useSnackbar();
  const [viewMonth, setViewMonth] = useState(() => dayjs().startOf('month'));
  const [entries, setEntries] = useState<LeaveCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<LeaveType | 'ALL'>('ALL');
  const [showLegend, setShowLegend] = useState(false);
  const [dayPopover, setDayPopover] = useState<DayPopoverState | null>(null);

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

  const filteredEntries = useMemo(
    () => (typeFilter === 'ALL' ? entries : entries.filter((entry) => entry.leaveType === typeFilter)),
    [entries, typeFilter]
  );

  const days = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const today = useMemo(() => dayjs(), []);

  const entriesByDay = useMemo(() => {
    const map = new Map<string, LeaveCalendarEntry[]>();
    days.forEach((day) => {
      const dayEntries = filteredEntries.filter(
        (entry) => !day.isBefore(dayjs(entry.startDate), 'day') && !day.isAfter(dayjs(entry.endDate), 'day')
      );
      if (dayEntries.length > 0) map.set(day.format('YYYY-MM-DD'), dayEntries);
    });
    return map;
  }, [days, filteredEntries]);

  const handleShowMore = useCallback(
    (event: React.MouseEvent<HTMLElement>, date: string, dayEntries: LeaveCalendarEntry[]) => {
      setDayPopover({ anchorEl: event.currentTarget, date, entries: dayEntries });
    },
    []
  );

  return (
    <div>
      <S.CalendarHeader>
        <S.MonthNav>
          <S.NavButton size="small" onClick={() => setViewMonth((m) => m.subtract(1, 'month'))} aria-label="Previous month">
            <ChevronLeftIcon fontSize="small" />
          </S.NavButton>
          <S.MonthLabel variant="subtitle1">{viewMonth.format('MMMM YYYY')}</S.MonthLabel>
          <S.NavButton size="small" onClick={() => setViewMonth((m) => m.add(1, 'month'))} aria-label="Next month">
            <ChevronRightIcon fontSize="small" />
          </S.NavButton>
        </S.MonthNav>

        <S.HeaderRight>
          <S.LegendToggle onClick={() => setShowLegend((v) => !v)}>
            <InfoOutlinedIcon fontSize="small" />
            Color guide
          </S.LegendToggle>
          <S.FilterWrapper>
            <StandaloneDropdown
              name="leaveTypeFilter"
              placeHolder="All types"
              preFetchedOptions={TYPE_FILTER_OPTIONS}
              defaultValue={typeFilter}
              onChange={(value) => setTypeFilter(String(value) as LeaveType | 'ALL')}
              hideErrorMessage
              disableClearable
              size="small"
            />
          </S.FilterWrapper>
        </S.HeaderRight>
      </S.CalendarHeader>

      {showLegend && (
        <S.LegendRow>
          {LEAVE_TYPE_OPTIONS.map((opt) => (
            <S.LegendItem key={opt.value}>
              <S.LegendDot colorKey={LEAVE_TYPE_COLOR_KEY[opt.value]} />
              {opt.label}
            </S.LegendItem>
          ))}
        </S.LegendRow>
      )}

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
              const isToday = day.isSame(today, 'day');
              const dateKey = day.format('YYYY-MM-DD');
              const dayEntries = entriesByDay.get(dateKey) || [];
              const visibleEntries = dayEntries.slice(0, MAX_VISIBLE_PER_DAY);
              const overflowCount = dayEntries.length - visibleEntries.length;

              return (
                <S.DayCell key={dateKey} isCurrentMonth={isCurrentMonth}>
                  <S.DayNumberRow>
                    <S.DayNumber isCurrentMonth={isCurrentMonth} isToday={isToday}>
                      {day.format('D')}
                    </S.DayNumber>
                  </S.DayNumberRow>
                  {visibleEntries.map((entry, idx) => (
                    <S.EntryChip
                      key={`${entry.workerId}-${idx}`}
                      colorKey={LEAVE_TYPE_COLOR_KEY[entry.leaveType]}
                      title={`${entry.workerName} — ${typeLabel(entry.leaveType)}`}
                    >
                      <S.EntryLabel>{entry.workerName}</S.EntryLabel>
                    </S.EntryChip>
                  ))}
                  {overflowCount > 0 && (
                    <S.MoreButton onClick={(e) => handleShowMore(e, dateKey, dayEntries)}>
                      +{overflowCount} more
                    </S.MoreButton>
                  )}
                </S.DayCell>
              );
            })}
          </S.GridContainer>
        </>
      )}

      <Popover
        open={!!dayPopover}
        anchorEl={dayPopover?.anchorEl}
        onClose={() => setDayPopover(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {dayPopover && (
          <S.PopoverContent>
            <S.PopoverTitle>{dayjs(dayPopover.date).format('MMMM D, YYYY')}</S.PopoverTitle>
            {dayPopover.entries.map((entry, idx) => (
              <S.PopoverEntry key={`${entry.workerId}-${idx}`}>
                <S.EntryDot colorKey={LEAVE_TYPE_COLOR_KEY[entry.leaveType]} />
                {entry.workerName} · {typeLabel(entry.leaveType)}
              </S.PopoverEntry>
            ))}
          </S.PopoverContent>
        )}
      </Popover>
    </div>
  );
};
