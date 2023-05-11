const { print_table } = require('../utils/print');
const {
  getAllActiveActivities,
  getAllDailyActivities,
} = require('./database/activity');

async function listActivities(database) {
  const data = await getAllActiveActivities(database);
  print_table(data);
  return data;
}

async function listActivitiesByDay(database) {
  const data = await getAllDailyActivities(database);
  print_table(data);
  return data;
}

// async function getActivity(database, id) {
//   const data = await getActivityById(database, id);
//   print_table(data);
// }

module.exports = { listActivities, listActivitiesByDay };
