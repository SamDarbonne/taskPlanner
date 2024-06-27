// prompt is you are a product manager with a list of tasks, attempting to determine whether or not the
// tasks can be completed in a given amount of time. Some tasks have other tasks as prerequisites.


function canCompleteTasks(tasks, totalTime) {
    const graph = new Map();
    const prereqMap = new Map();
    const times = new Map();
  
    // build our graph
    tasks.forEach((task) => {
      graph.set(task.id, []);
      prereqMap.set(task.id, 0);
      times.set(task.id, task.time);
    });
  
    tasks.forEach((task) => {
      task.prerequisites.forEach((prerequisite) => {
        graph.get(prerequisite).push(task.id);
        prereqMap.set(task.id, prereqMap.get(task.id) + 1);
      });
    });
  
    // start our search, starting with tasks that have no prerequisites
    const frontier = [];
    prereqMap.forEach((count, taskId) => {
      if (count === 0) {
        frontier.push({ taskId, time: times.get(taskId) });
      }
    });
  
    frontier.sort((a, b) => a.time - b.time);
  
    let currentTime = 0;
    let completedTasks = 0;
  
    while (frontier.length > 0) {
      const { taskId, time } = frontier.shift();
      currentTime = Math.max(currentTime, time);
  
      if (currentTime > totalTime) {
        return false;
      }
  
      completedTasks++;
  
      graph.get(taskId).forEach((nextTaskId) => {
        prereqMap.set(nextTaskId, prereqMap.get(nextTaskId) - 1);
        if (prereqMap.get(nextTaskId) === 0) {
          frontier.push({
            taskId: nextTaskId,
            time: currentTime + times.get(nextTaskId),
          });
        }
      });
  
      frontier.sort((a, b) => a.time - b.time);
    }
  
    return completedTasks === tasks.length;
  }
  
  const tasks = [
    { id: 1, time: 3, prerequisites: [] },
    { id: 2, time: 2, prerequisites: [1] },
    { id: 3, time: 1, prerequisites: [1] },
    { id: 4, time: 4, prerequisites: [2, 3] },
  ];
  
  const totalTime = 10;
  
  console.log(canCompleteTasks(tasks, totalTime));
  