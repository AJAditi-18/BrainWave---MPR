import React, { useState, useEffect } from 'react';
import Card from '../common/card';
import Badge from '../common/Badge';

const ExamCountdown = ({ exams = [] }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateTimeLeft = (examDate) => {
    const difference = new Date(examDate) - currentTime;
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return null;
  };

  const formatTimeUnit = (value, unit) => {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-brainwave-primary">
          {value.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {unit}
        </div>
      </div>
    );
  };

  const getUrgencyColor = (timeLeft) => {
    if (!timeLeft) return 'error';
    const totalHours = timeLeft.days * 24 + timeLeft.hours;
    if (totalHours <= 24) return 'error';
    if (totalHours <= 72) return 'warning';
    return 'success';
  };

  const upcomingExams = exams
    .filter(exam => new Date(exam.date) > currentTime)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg className="h-5 w-5 text-brainwave-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Upcoming Exams
        </h3>
        <Badge variant="info" size="sm">
          {upcomingExams.length} upcoming
        </Badge>
      </div>

      {upcomingExams.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming exams</h3>
          <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingExams.map((exam, index) => {
            const timeLeft = calculateTimeLeft(exam.date);
            const urgency = getUrgencyColor(timeLeft);
            
            return (
              <div key={exam.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{exam.title}</h4>
                    <p className="text-sm text-gray-500">{exam.subject}</p>
                  </div>
                  <Badge variant={urgency} size="sm">
                    {urgency === 'error' ? 'Critical' : urgency === 'warning' ? 'Soon' : 'Upcoming'}
                  </Badge>
                </div>

                {timeLeft ? (
                  <div className="grid grid-cols-4 gap-4 text-center">
                    {formatTimeUnit(timeLeft.days, 'Days')}
                    {formatTimeUnit(timeLeft.hours, 'Hours')}
                    {formatTimeUnit(timeLeft.minutes, 'Min')}
                    {formatTimeUnit(timeLeft.seconds, 'Sec')}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <span className="text-red-600 font-medium">Exam has passed</span>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    📅 {new Date(exam.date).toLocaleDateString()} at {new Date(exam.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className="text-gray-500">
                    📍 {exam.location || 'Online'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default ExamCountdown;
