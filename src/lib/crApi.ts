import axios from "axios";
import { showAlert } from "./swal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/realbizpro/api/v1";

const crClient = axios.create({
  baseURL: `${API_BASE}/credit-realization`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const crApi = {
  // Setups & Policies
  async getSetups() {
    try {
      const res = await crClient.get("/setups");
      return res.data?.data || res.data || [];
    } catch (err: any) {
      console.error("Error fetching CR setups:", err);
      showAlert.error("Failed to load policies", err.response?.data?.message || err.message);
      return [];
    }
  },

  async createSetup(dto: any) {
    try {
      const res = await crClient.post("/setups", dto);
      showAlert.success("Installment Setup Created", "Policy has been configured successfully.");
      return res.data?.data || res.data;
    } catch (err: any) {
      showAlert.error("Setup Creation Failed", err.response?.data?.message || err.message);
      throw err;
    }
  },

  // Sale Agreements & Amortization
  async getAgreements() {
    try {
      const res = await crClient.get("/agreements");
      return res.data?.data || res.data || [];
    } catch (err: any) {
      console.error("Error fetching CR agreements:", err);
      showAlert.error("Failed to load agreements", err.response?.data?.message || err.message);
      return [];
    }
  },

  async getAgreementDetails(uuid: string) {
    try {
      const res = await crClient.get(`/agreements/${uuid}`);
      return res.data?.data || res.data;
    } catch (err: any) {
      showAlert.error("Failed to load agreement details", err.response?.data?.message || err.message);
      return null;
    }
  },

  async createAgreement(dto: any) {
    try {
      const res = await crClient.post("/agreements", dto);
      showAlert.success("Sale Agreement Created", "Agreement and amortization schedule generated.");
      return res.data?.data || res.data;
    } catch (err: any) {
      showAlert.error("Agreement Creation Failed", err.response?.data?.message || err.message);
      throw err;
    }
  },

  // Installments, Overdue & Payments
  async getOverdueInstallments() {
    try {
      const res = await crClient.get("/installments/overdue");
      return res.data?.data || res.data || [];
    } catch (err: any) {
      console.error("Error fetching overdue installments:", err);
      showAlert.error("Failed to load overdue list", err.response?.data?.message || err.message);
      return [];
    }
  },

  async recordPayment(installmentUuid: string, dto: any) {
    try {
      const res = await crClient.post(`/installments/${installmentUuid}/payments`, dto);
      showAlert.success("Payment Recorded", `Voucher ${dto.payment_voucher_no || ""} logged successfully.`);
      return res.data?.data || res.data;
    } catch (err: any) {
      showAlert.error("Payment Recording Failed", err.response?.data?.message || err.message);
      throw err;
    }
  },

  async waivePenalty(installmentUuid: string, dto: { amount_to_waive: number; reason: string }) {
    try {
      const res = await crClient.post(`/installments/${installmentUuid}/waive-penalty`, dto);
      showAlert.success("Penalty Waived", `Amount waived: ${dto.amount_to_waive} BDT.`);
      return res.data?.data || res.data;
    } catch (err: any) {
      showAlert.error("Waiver Failed", err.response?.data?.message || err.message);
      throw err;
    }
  },

  // Recovery Logs
  async getRecoveryLogs() {
    try {
      const res = await crClient.get("/recovery");
      return res.data?.data || res.data || [];
    } catch (err: any) {
      console.error("Error fetching recovery logs:", err);
      showAlert.error("Failed to load recovery logs", err.response?.data?.message || err.message);
      return [];
    }
  },

  async createRecoveryLog(dto: any) {
    try {
      const res = await crClient.post("/recovery", dto);
      showAlert.success("Recovery Action Logged", "Follow-up record saved successfully.");
      return res.data?.data || res.data;
    } catch (err: any) {
      showAlert.error("Recovery Logging Failed", err.response?.data?.message || err.message);
      throw err;
    }
  },

  // Reports
  async getAgingAnalysis() {
    try {
      const res = await crClient.get("/reports/aging-analysis");
      return res.data?.data || res.data;
    } catch (err: any) {
      console.error("Error fetching aging report:", err);
      showAlert.error("Failed to load aging matrix", err.response?.data?.message || err.message);
      return null;
    }
  },

  async getOverdueSummary() {
    try {
      const res = await crClient.get("/reports/overdue-summary");
      return res.data?.data || res.data;
    } catch (err: any) {
      console.error("Error fetching overdue summary:", err);
      showAlert.error("Failed to load summary", err.response?.data?.message || err.message);
      return null;
    }
  },

  async getCollectionSummary() {
    try {
      const res = await crClient.get("/reports/collection-summary");
      return res.data?.data || res.data;
    } catch (err: any) {
      console.error("Error fetching collection summary:", err);
      showAlert.error("Failed to load collection summary", err.response?.data?.message || err.message);
      return null;
    }
  },
};
