import {BaseService} from '../core/base.service';
import {
  Badge,
  BadgeScoreData,
  UserBadge,
  ScoreCalculationRequest,
  ScoreCalculationResponse,
  BadgeStatistics,
  ScoreAlgorithmParams,
  BadgeBatchImportRequest,
  BadgeBatchImportResponse,
  BadgeSafeResponse,
} from './types';

/**
 * 徽章服务类
 * 处理徽章相关的API调用和算分机制
 */
export class BadgeServiceClass extends BaseService {
  /**
   * API基础路径
   */
  protected static basePath = '/api/v1/badges';

  /**
   * 获取所有徽章列表
   */
  static async getAllBadges(): Promise<Badge[]> {
    return this.get<Badge[]>('/');
  }

  /**
   * 安全获取所有徽章列表
   */
  static async getAllBadgesSafe(): Promise<BadgeSafeResponse<Badge[]>> {
    try {
      const badges = await this.getAllBadges();
      return {
        success: true,
        data: badges,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取徽章列表失败',
      };
    }
  }

  /**
   * 根据ID获取徽章信息
   */
  static async getBadgeById(id: number): Promise<Badge> {
    return this.get<Badge>(`/${id}`);
  }

  /**
   * 安全获取徽章信息
   */
  static async getBadgeByIdSafe(id: number): Promise<BadgeSafeResponse<Badge>> {
    try {
      const badge = await this.getBadgeById(id);
      return {
        success: true,
        data: badge,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取徽章信息失败',
      };
    }
  }

  /**
   * 获取用户徽章列表
   */
  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    return this.get<UserBadge[]>(`/user/${userId}`);
  }

  /**
   * 安全获取用户徽章列表
   */
  static async getUserBadgesSafe(userId: string): Promise<BadgeSafeResponse<UserBadge[]>> {
    try {
      const badges = await this.getUserBadges(userId);
      return {
        success: true,
        data: badges,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取用户徽章失败',
      };
    }
  }

  /**
   * 执行徽章算分计算
   */
  static async calculateBadgeScores(request: ScoreCalculationRequest): Promise<ScoreCalculationResponse> {
    return this.post<ScoreCalculationResponse>('/calculate', request);
  }

  /**
   * 安全执行徽章算分计算
   */
  static async calculateBadgeScoresSafe(request: ScoreCalculationRequest): Promise<ScoreCalculationResponse> {
    try {
      const result = await this.calculateBadgeScores(request);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '算分计算失败',
      };
    }
  }

  /**
   * 获取徽章统计信息
   */
  static async getBadgeStatistics(): Promise<BadgeStatistics> {
    return this.get<BadgeStatistics>('/statistics');
  }

  /**
   * 安全获取徽章统计信息
   */
  static async getBadgeStatisticsSafe(): Promise<BadgeSafeResponse<BadgeStatistics>> {
    try {
      const statistics = await this.getBadgeStatistics();
      return {
        success: true,
        data: statistics,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取统计信息失败',
      };
    }
  }

  /**
   * 获取算分算法参数
   */
  static async getAlgorithmParams(): Promise<ScoreAlgorithmParams> {
    return this.get<ScoreAlgorithmParams>('/algorithm/params');
  }

  /**
   * 安全获取算分算法参数
   */
  static async getAlgorithmParamsSafe(): Promise<BadgeSafeResponse<ScoreAlgorithmParams>> {
    try {
      const params = await this.getAlgorithmParams();
      return {
        success: true,
        data: params,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取算法参数失败',
      };
    }
  }

  /**
   * 更新算分算法参数
   */
  static async updateAlgorithmParams(params: ScoreAlgorithmParams): Promise<ScoreAlgorithmParams> {
    return this.put<ScoreAlgorithmParams>('/algorithm/params', params);
  }

  /**
   * 安全更新算分算法参数
   */
  static async updateAlgorithmParamsSafe(params: ScoreAlgorithmParams): Promise<BadgeSafeResponse<ScoreAlgorithmParams>> {
    try {
      const result = await this.updateAlgorithmParams(params);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '更新算法参数失败',
      };
    }
  }

  /**
   * 批量导入徽章数据
   */
  static async batchImportBadges(request: BadgeBatchImportRequest): Promise<BadgeBatchImportResponse> {
    return this.post<BadgeBatchImportResponse>('/batch-import', request);
  }

  /**
   * 安全批量导入徽章数据
   */
  static async batchImportBadgesSafe(request: BadgeBatchImportRequest): Promise<BadgeBatchImportResponse> {
    try {
      const result = await this.batchImportBadges(request);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '批量导入失败',
      };
    }
  }

  /**
   * 重新计算所有徽章分数
   */
  static async recalculateAllScores(): Promise<ScoreCalculationResponse> {
    return this.post<ScoreCalculationResponse>('/recalculate-all');
  }

  /**
   * 安全重新计算所有徽章分数
   */
  static async recalculateAllScoresSafe(): Promise<ScoreCalculationResponse> {
    try {
      const result = await this.recalculateAllScores();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '重新计算分数失败',
      };
    }
  }

  /**
   * 获取徽章分数历史记录
   */
  static async getBadgeScoreHistory(badgeId: number, limit = 10): Promise<BadgeScoreData[]> {
    return this.get<BadgeScoreData[]>(`/${badgeId}/score-history`, { limit });
  }

  /**
   * 安全获取徽章分数历史记录
   */
  static async getBadgeScoreHistorySafe(badgeId: number, limit = 10): Promise<BadgeSafeResponse<BadgeScoreData[]>> {
    try {
      const history = await this.getBadgeScoreHistory(badgeId, limit);
      return {
        success: true,
        data: history,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取分数历史失败',
      };
    }
  }

  /**
   * 导出徽章数据为JSON
   */
  static async exportBadgesToJSON(): Promise<BadgeScoreData[]> {
    return this.get<BadgeScoreData[]>('/export/json');
  }

  /**
   * 安全导出徽章数据为JSON
   */
  static async exportBadgesToJSONSafe(): Promise<BadgeSafeResponse<BadgeScoreData[]>> {
    try {
      const data = await this.exportBadgesToJSON();
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出JSON数据失败',
      };
    }
  }
} 