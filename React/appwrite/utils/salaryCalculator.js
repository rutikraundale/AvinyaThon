//  Labor Weekly Salary
export const calculateLaborSalary = (attendance, dailyWage) => {
  const presentDays = attendance.filter(
    (a) => a.status === "present"
  ).length;

  return presentDays * dailyWage;
};

//  Engineer Monthly Salary
export const calculateEngineerSalary = (attendance, monthlySalary) => {
  const presentDays = attendance.filter(
    (a) => a.status === "present"
  ).length;

  const perDay = monthlySalary / 30;

  return perDay * presentDays;
};