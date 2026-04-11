import { User, IUser } from '../models/User';

export class UserService {
  /**
   * Get all users
   */
  async getAllUsers(): Promise<IUser[]> {
    return User.find();
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  /**
   * Get users by type (user or bank)
   */
  async getUsersByType(type: 'user' | 'bank'): Promise<IUser[]> {
    return User.find({ type });
  }

  /**
   * Get users by location
   */
  async getUsersByLocation(divisionId: number, districtId?: number): Promise<IUser[]> {
    const query: any = { divisionId };
    if (districtId) {
      query.districtId = districtId;
    }
    return User.find(query);
  }

  /**
   * Create a new user
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  /**
   * Update user
   */
  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, userData, { new: true });
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<IUser | null> {
    return (await User.findByIdAndDelete(id)) as unknown as IUser | null;
  }

  /**
   * Get banks in a location
   */
  async getBanksByLocation(divisionId: number, districtId?: number): Promise<IUser[]> {
    const query: any = { type: 'bank', divisionId };
    if (districtId) {
      query.districtId = districtId;
    }
    return User.find(query);
  }

  /**
   * Search users by name
   */
  async searchUsers(name: string): Promise<IUser[]> {
    return User.find({ name: { $regex: name, $options: 'i' } });
  }

  /**
   * Login user with email or contact number and password
   */
  async login(loginName: string, password: string): Promise<IUser | null> {
    // Find user by email or contact number
    const user = await User.findOne({
      $or: [
        { email: loginName },
        { contactNumber: loginName }
      ]
    });

    if (!user) {
      return null;
    }

    // In production, use bcrypt to compare passwords
    // For now, direct comparison (not recommended for production)
    if (user.password !== password) {
      return null;
    }

    return user;
  }
}
