import { Injectable, NotFoundException } from '@nestjs/common';
import { Balance } from './entities/balance.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

/**
 * Represents a service for handling users balance in the system.
 * @class
 *
 * @field @private balanceCache
 * @field @private CACHE_TTL
 *
 * @method getUserBalance
 */
@Injectable()
export class BalanceService {
  /**
   * In-memory cache for user balances
   * @type {Map<string, { balance: Balance; expiry: number }>}
   */
  private balanceCache: Map<string, { balance: Balance; expiry: number }> =
    new Map();

  /**
   * Cache TTL (time-to-live) in milliseconds
   * @type {number}
   */
  private readonly CACHE_TTL: number = 60000; // 1 minute

  /**
   * Creates an instance of BalanceService.
   * @param {Repository<Balance>} balanceRepository - The repository for accessing balance data.
   */
  constructor(
    @InjectRepository(Balance)
    private readonly balanceRepository: Repository<Balance>,
    private readonly userService: UserService,
  ) {}

  /**
   * Fetch user's balance, first checking the cache
   * @method
   *
   * @param {string} userId - The user's ID.
   * @returns {Promise<Balance>} A promise that resolves when balance is found.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   */
  async getUserBalance(userId: string): Promise<Balance> {
    const now = Date.now();

    const cached = this.balanceCache.get(userId);
    if (cached && cached.expiry > now) {
      return cached.balance;
    }

    const user = await this.userService.findOne(userId);

    if (!user || !user.balance) {
      throw new NotFoundException(
        `Balance not found for user with ID ${userId}`,
      );
    }

    this.balanceCache.set(userId, {
      balance: user.balance,
      expiry: now + this.CACHE_TTL,
    });

    return user.balance;
  }

  /**
   * Update user's balance and reset the cache
   * @method
   *
   * @param {string} userId - The user's ID.
   * @returns {Promise<void>} A promise that resolves when balance is updated.
   * @throws {NotFoundException} If the user with the given user ID is not found.
   */
  async updateUserBalance(userId: string, balance: Balance): Promise<void> {
    const user = await this.userService.findOne(userId);

    if (!user || !user.balance) {
      throw new NotFoundException(
        `Balance not found for user with ID ${userId}`,
      );
    }

    // Update the cache with the new balance
    this.balanceCache.set(userId, {
      balance: balance,
      expiry: Date.now() + this.CACHE_TTL,
    });
  }

  /**
   * Manually clear the cache
   * @method
   */
  clearCache(userId: string) {
    this.balanceCache.delete(userId);
  }
}
