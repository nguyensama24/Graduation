import axios from "axios";
import { Statistics } from "../model/StatsModels";
import { FilterChart } from "../helper/Date/DataHelper";

export const appConfig = {
  apiUrl: import.meta.env.VITE_BACKEND_STATISTICS_URL || "",
};

class StatsControllers {
  getStats = async (data: FilterChart): Promise<Statistics> => {
    return await axios.post(`${appConfig.apiUrl}`, data).then((res) => {
      return res.data as Statistics;
    });
  };
}
export const statsControllers = new StatsControllers();
