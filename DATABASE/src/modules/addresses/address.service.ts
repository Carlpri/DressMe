import { ApiError } from "../../utils/api-error.js";
import { AddressRepository } from "./address.repository.js";
import type {
  CreateAddressDto,
  UpdateAddressDto,
} from "./address.types.js";

export class AddressService {
  private repository = new AddressRepository();

  private normalizeAddressValue(value?: string | null) {
    return value?.trim().toLowerCase() ?? "";
  }

  private isEquivalentAddress(
    existingAddress: Record<string, unknown>,
    candidateAddress: Record<string, unknown>
  ) {
    return (
      this.normalizeAddressValue(existingAddress.fullName as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.fullName as string | undefined) &&
      this.normalizeAddressValue(existingAddress.phone as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.phone as string | undefined) &&
      this.normalizeAddressValue(existingAddress.county as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.county as string | undefined) &&
      this.normalizeAddressValue(existingAddress.city as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.city as string | undefined) &&
      this.normalizeAddressValue(existingAddress.area as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.area as string | undefined) &&
      this.normalizeAddressValue(existingAddress.street as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.street as string | undefined) &&
      this.normalizeAddressValue(existingAddress.building as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.building as string | undefined) &&
      this.normalizeAddressValue(existingAddress.postalCode as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.postalCode as string | undefined) &&
      this.normalizeAddressValue(existingAddress.landmark as string | undefined) ===
        this.normalizeAddressValue(candidateAddress.landmark as string | undefined)
    );
  }

  private async assertNoDuplicateAddress(
    userId: string,
    candidateAddress: Record<string, unknown>,
    currentAddressId?: string
  ) {
    const addresses = await this.repository.findAllByUser(userId);

    const duplicate = addresses.some((address) => {
      if (currentAddressId && address.id === currentAddressId) {
        return false;
      }

      return this.isEquivalentAddress(address as Record<string, unknown>, candidateAddress);
    });

    if (duplicate) {
      throw new ApiError(409, "An identical address already exists for this user.");
    }
  }

  async create(userId: string, data: CreateAddressDto) {
    const count = await this.repository.countByUser(userId);
    const isDefault = data.isDefault ?? count === 0;

    await this.assertNoDuplicateAddress(userId, data as unknown as Record<string, unknown>);

    if (isDefault) {
      await this.repository.setAllNonDefaultForUser(userId);
    }

    return this.repository.create(userId, {
      ...data,
      isDefault,
    });
  }

  async getAll(userId: string) {
    return this.repository.findAllByUser(userId);
  }

  async getById(userId: string, id: string) {
    const address = await this.repository.findById(id);

    if (!address || address.userId !== userId) {
      throw new ApiError(404, "Address not found.");
    }

    return address;
  }

  async getDefault(userId: string) {
    const address = await this.repository.findDefaultByUser(userId);

    if (!address) {
      throw new ApiError(404, "No default address found.");
    }

    return address;
  }

  async update(userId: string, id: string, data: UpdateAddressDto) {
    const address = await this.repository.findById(id);

    if (!address || address.userId !== userId) {
      throw new ApiError(404, "Address not found.");
    }

    const candidateAddress = {
      fullName: data.fullName ?? address.fullName,
      phone: data.phone ?? address.phone,
      county: data.county ?? address.county,
      city: data.city ?? address.city,
      area: data.area ?? address.area,
      street: data.street ?? address.street,
      building: data.building ?? address.building,
      postalCode: data.postalCode ?? address.postalCode,
      landmark: data.landmark ?? address.landmark,
    };

    await this.assertNoDuplicateAddress(userId, candidateAddress, id);

    if (data.isDefault === true) {
      await this.repository.setAllNonDefaultForUser(userId);
    }

    return this.repository.update(id, data as unknown as Record<string, unknown>);
  }

  async setDefault(userId: string, id: string) {
    const address = await this.repository.findById(id);

    if (!address || address.userId !== userId) {
      throw new ApiError(404, "Address not found.");
    }

    await this.repository.setAllNonDefaultForUser(userId);

    return this.repository.update(id, {
      isDefault: true,
    });
  }

  async delete(userId: string, id: string) {
    const address = await this.repository.findById(id);

    if (!address || address.userId !== userId) {
      throw new ApiError(404, "Address not found.");
    }

    const addressCount = await this.repository.countByUser(userId);

    if (addressCount === 1) {
      throw new ApiError(409, "You cannot delete your only saved address.");
    }

    await this.repository.delete(id);

    if (address.isDefault) {
      const remaining = await this.repository.findAllByUser(userId);

      if (remaining.length > 0) {
        const newDefault = remaining[0];
        await this.repository.update(newDefault.id, {
          isDefault: true,
        });
      }
    }
  }
}
