import { axiosInstance } from "../../lib/config";
import { LoginInput, Member, MemberInput, MemberUpdateInput } from "../../lib/types/member";

class MemberService {
  public async getShop(): Promise<Member> {
    try {
      const result = await axiosInstance.get<Member>("/member/shop");
      return result.data;
    } catch (err) {
      console.log("Error, getShop:", err);
      throw err;
    }
  }

  public async getTopUsers(): Promise<Member[]> {
    try {
      const result = await axiosInstance.get<Member[]>("/member/top-users");
      return result.data;
    } catch (err) {
      console.log("Error, getTopUsers:", err);
      throw err;
    }
  }

  public async getMemberDetail(): Promise<Member> {
    try {
      const result = await axiosInstance.get<Member>("/member/detail");
      return result.data;
    } catch (err) {
      console.log("Error, getMemberDetail:", err);
      throw err;
    }
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      const result = await axiosInstance.post<Member>("/member/signup", input);
      const member: Member = result.data;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("Error, signup:", err);
      throw err;
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    try {
      const result = await axiosInstance.post<Member>("/member/login", input);
      const member: Member = result.data;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("Error, login:", err);
      throw err;
    }
  }

  public async logout(): Promise<void> {
    try {
      await axiosInstance.post("/member/logout", {});
      localStorage.removeItem("memberData");
    } catch (err) {
      console.log("Error, logout:", err);
      throw err;
    }
  }

  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      const formData = new FormData();
      if (input.memberNick !== undefined) formData.append("memberNick", input.memberNick);
      if (input.memberPhone !== undefined) formData.append("memberPhone", input.memberPhone);
      if (input.memberAddress !== undefined) formData.append("memberAddress", input.memberAddress);
      if (input.memberDesc !== undefined) formData.append("memberDesc", input.memberDesc);
      if (input.memberImage instanceof File) formData.append("memberImage", input.memberImage);

      const result = await axiosInstance.post<Member>("/member/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const member: Member = result.data;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      console.log("Error, updateMember:", err);
      throw err;
    }
  }
}

export default MemberService;
