export const QuearyDropDownSelections = [
  { title: "Kumeu Metwatch Station", value: "KumeuMetWatch" },
  { title: "Weather Station 1 - In Development", value: "Node 1" },
  { title: "Weather Station 2 - In Development", value: "Node 2" },
  { title: "Weather Station 3 - In Development", value: "Node 3" },
  { title: "Weather Station 4 - In Development", value: "Node 4" },
];

export const defaultRefreshtime = 5000;

export const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
