export function calculateAverageTime(times: string[]): string {
  const timesInSeconds = times.map(time => {
    let days = 0;
    let hours, minutes, seconds;
    let totalHours = 0;

    if (time.includes(".")) {
      days = time.split('.').map(Number)[0] * 24;
      [hours, minutes, seconds] = time.split('.')[1].split(':').map(Number);
      totalHours = days + hours;
    }
    else {
      [hours, minutes, seconds] = time.split(':').map(Number);
      totalHours = hours;
    }

    return totalHours * 3600 + minutes * 60 + seconds;
  });

  const totalSeconds = timesInSeconds.reduce((sum, seconds) => sum + seconds, 0);

  const averageSeconds = totalSeconds / times.length;

  const hours = Math.floor(averageSeconds / 3600);
  const remainingSeconds = averageSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);

 const format = (num: number) => num.toString().padStart(2, '0');

  return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
}
