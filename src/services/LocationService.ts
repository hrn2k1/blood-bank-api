import { Location, ILocation } from '../models/Location';

export class LocationService {
  /**
   * Get all locations
   */
  async getAllLocations(): Promise<ILocation[]> {
    return Location.find();
  }

  /**
   * Get location by ID
   */
  async getLocationById(id: number): Promise<ILocation | null> {
    return Location.findOne({ id });
  }

  /**
   * Get all divisions
   */
  async getDivisions(): Promise<ILocation[]> {
    return Location.find({ type: 'division' });
  }

  /**
   * Get districts by division ID
   */
  async getDistrictsByDivision(divisionId: number): Promise<ILocation[]> {
    return Location.find({ parentId: divisionId, type: 'district' });
  }

  /**
   * Get thanas by district ID
   */
  async getThanasByDistrict(districtId: number): Promise<ILocation[]> {
    return Location.find({ parentId: districtId, type: 'thana' });
  }

  /**
   * Get areas by thana ID
   */
  async getAreasByThana(thanaId: number): Promise<ILocation[]> {
    return Location.find({ parentId: thanaId, type: 'area' });
  }

  /**
   * Get locations by type
   */
  async getLocationsByType(type: 'division' | 'district' | 'thana' | 'area'): Promise<ILocation[]> {
    return Location.find({ type });
  }

  /**
   * Get child locations
   */
  async getChildLocations(parentId: number): Promise<ILocation[]> {
    return Location.find({ parentId });
  }

  /**
   * Create a new location
   */
  async createLocation(locationData: Partial<ILocation>): Promise<ILocation> {
    const location = new Location(locationData);
    return location.save();
  }

  /**
   * Update location
   */
  async updateLocation(id: number, locationData: Partial<ILocation>): Promise<ILocation | null> {
    return Location.findOneAndUpdate({ id }, locationData, { new: true });
  }

  /**
   * Delete location
   */
  async deleteLocation(id: number): Promise<ILocation | null> {
    return (await Location.findOneAndDelete({ id })) as unknown as ILocation | null;
  }

  /**
   * Search locations by name
   */
  async searchLocations(name: string): Promise<ILocation[]> {
    return Location.find({ name: { $regex: name, $options: 'i' } });
  }
}
