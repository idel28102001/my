import {
  addDays,
  addMinutes,
  compareAsc,
  format,
  getDate,
  getDay,
  getMonth,
  getYear,
  isWithinInterval,
  setHours,
  subMinutes,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { SignupsEnum } from '../signups/enums/signups.enum';
import { SignupsEntity } from '../signups/entities/signups.entity';

const months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];
const days = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресение',
];

const makeMoscow = (...args) => {
  return utcToZonedTime(new Date(args as any), 'Europe/Moscow');
};

export const getMainDate = (date: Date) => {
  return format(makeMoscow(date), 'yyyy-MM-dd');
};

export const getMainTime = (date: Date) => {
  return format(makeMoscow(date), 'HH:mm');
};

export const orderTimes = (times: Array<string>) => {
  return times.sort((a, b) => {
    const aa = makeMoscow(`${getMainDate(new Date())} ${a}`);
    const bb = makeMoscow(`${getMainDate(new Date())} ${b}`);
    return compareAsc(aa, bb);
  });
};

export const orderEntTimes = (times: Array<SignupsEntity>) => {
  return times.sort((a, b) => {
    const aa = makeMoscow(a.date);
    const bb = makeMoscow(b.date);
    return compareAsc(aa, bb);
  });
};
export const getInterval = (
  nextDiap: SignupsEnum,
  previousDiap: SignupsEnum,
  time: string,
) => {
  const first = makeMoscow(`${getMainDate(new Date())} ${time}`);
  const add = nextDiap === SignupsEnum.CONSULTATION ? 29 : 89;
  const sub = previousDiap === SignupsEnum.CONSULTATION ? 29 : 89;
  const end = addMinutes(first, add);
  const start = subMinutes(first, sub);
  return { start, end };
};

export const getTimes = (
  type: SignupsEnum,
  filters = [],
  etc: SignupsEntity[],
) => {
  const date = utcToZonedTime(getMainDate(new Date()), 'Europe/Moscow');
  const allTimes = [];
  const filts = filters.map((e) => getInterval(type, type, e));
  const etcFilters = etc.map((e) =>
    getInterval(e.type, type, getMainTime(e.date)),
  );
  let startTime = setHours(date, 8);
  const endTime = setHours(date, 20);
  while (compareAsc(startTime, endTime) !== 1) {
    const curr = filts.some((e) =>
      isWithinInterval(startTime, { end: e.end, start: e.start }),
    );
    const second = etcFilters.some((e) =>
      isWithinInterval(startTime, { end: e.end, start: e.start }),
    );
    if (curr || second) {
      startTime = addMinutes(startTime, 30);
      continue;
    }
    allTimes.push(getMainTime(startTime));
    startTime = addMinutes(startTime, 30);
  }
  return allTimes;
};

export const createKeyboard = (elems) => {
  const result = [];
  const process = [];
  for (let i = 0; i < elems.length; i++) {
    process.push({ text: elems[i] });
    if (process.length === 4 || elems.length - 1 === i) {
      result.push([...process]);
      process.length = 0;
    }
  }
  return result;
};

export const getDateFromDays = (day: string, date: Date) => {
  const result = /(?<day>\d+) (?<month>[а-я]+)/g.exec(day).groups;
  const month = months.indexOf(result.month) + 2;
  return makeMoscow(getYear(date), month, Number(result.day));
};

export const getNDays = (daysCount: number, startDate: Date) => {
  const allDays = [];
  let num = 0;
  let emptyArray = [];
  for (let i = 0; i < daysCount; i++) {
    const currDate = addDays(startDate, i);
    const month = months[getMonth(currDate) - 1];
    const weekDay = days[getDay(currDate)];
    const date = getDate(currDate);
    emptyArray.push({ text: `${date} ${month} (${weekDay})` });
    num++;
    if (num === 2 || i + 1 === daysCount) {
      allDays.push(emptyArray);
      num = 0;
      emptyArray = [];
    }
  }
  return allDays;
};
