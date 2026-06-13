import { axiosInstance } from "../../lib/config";
import { ContactInput } from "../../lib/types/notification";

class NotificationService {
  public async createContact(input: ContactInput): Promise<void> {
    try {
      await axiosInstance.post("/inquiry/create", input);
    } catch (err) {
      console.log("Error, createContact:", err);
      throw err;
    }
  }
}

export default NotificationService;
