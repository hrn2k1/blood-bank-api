import { BloodRequest, IBloodRequest } from '../models/BloodRequest';

export class BloodRequestService {
  /**
   * Get all blood requests
   */
  async getAllBloodRequests(): Promise<IBloodRequest[]> {
    return BloodRequest.find();
  }

  /**
   * Get blood request by ID
   */
  async getBloodRequestById(id: string): Promise<IBloodRequest | null> {
    return BloodRequest.findOne({ id });
  }

  /**
   * Get blood requests by requester ID
   */
  async getBloodRequestsByRequesterId(requesterId: string): Promise<IBloodRequest[]> {
    return BloodRequest.find({ requesterId });
  }

  /**
   * Get blood requests by bank ID
   */
  async getBloodRequestsByBankId(bankId: string): Promise<IBloodRequest[]> {
    return BloodRequest.find({ bankId });
  }

  /**
   * Get blood requests by status
   */
  async getBloodRequestsByStatus(status: 'pending' | 'approved' | 'completed' | 'rejected'): Promise<IBloodRequest[]> {
    return BloodRequest.find({ status });
  }

  /**
   * Get blood requests by blood group
   */
  async getBloodRequestsByBloodGroup(bloodGroup: string): Promise<IBloodRequest[]> {
    return BloodRequest.find({ bloodGroup });
  }

  /**
   * Get urgent blood requests
   */
  async getUrgentBloodRequests(): Promise<IBloodRequest[]> {
    return BloodRequest.find({ urgencyLevel: { $in: ['high', 'critical'] } });
  }

  /**
   * Create a new blood request
   */
  async createBloodRequest(requestData: Partial<IBloodRequest>): Promise<IBloodRequest> {
    const request = new BloodRequest(requestData);
    return request.save();
  }

  /**
   * Update blood request
   */
  async updateBloodRequest(id: string, requestData: Partial<IBloodRequest>): Promise<IBloodRequest | null> {
    return BloodRequest.findOneAndUpdate({ id }, requestData, { new: true });
  }

  /**
   * Delete blood request
   */
  async deleteBloodRequest(id: string): Promise<IBloodRequest | null> {
    return (await BloodRequest.findOneAndDelete({ id })) as unknown as IBloodRequest | null;
  }

  /**
   * Add donor to blood request
   */
  async addDonorToRequest(requestId: string, donorData: { donorId: string; unitsDonated: number; donationDate: Date }): Promise<IBloodRequest | null> {
    return BloodRequest.findOneAndUpdate(
      { id: requestId },
      { $push: { donors: donorData } },
      { new: true }
    );
  }

  /**
   * Update blood request status
   */
  async updateBloodRequestStatus(id: string, status: 'pending' | 'approved' | 'completed' | 'rejected'): Promise<IBloodRequest | null> {
    return BloodRequest.findOneAndUpdate({ id }, { status }, { new: true });
  }
}
