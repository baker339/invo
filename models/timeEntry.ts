export default interface TimeEntry {
  _id: string;
  userid: string;
  description: string;
  timeSpent: number;
  date: string;
  createdAt: string;
  project: string;
  client: string;
}
