/**
 * 徽章服务相关类型定义
 */

/**
 * 徽章基本信息
 */
export interface Badge {
  id: number;
  name: string;
  description: string;
  score?: number;
  rarity_level?: string;
  badge_group?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 徽章算分数据
 */
export interface BadgeScoreData {
  id: number;
  name: string;
  total_contribution: number;
  badge_score: number;
  rarity_level: string;
  badge_group: string;
  score_explanation: string;
}

/**
 * 用户徽章信息
 */
export interface UserBadge extends Badge {
  obtained_at: string;
  user_id: string;
}

/**
 * 算分请求参数
 */
export interface ScoreCalculationRequest {
  badge_ids?: number[];
  user_id?: string;
  calculation_type: 'all' | 'user_specific' | 'badge_specific';
}

/**
 * 算分响应结果
 */
export interface ScoreCalculationResponse {
  success: boolean;
  data?: {
    scores: BadgeScoreData[];
    total_badges: number;
    calculation_time: string;
    algorithm_version: string;
  };
  error?: string;
}

/**
 * 徽章统计信息
 */
export interface BadgeStatistics {
  total_badges: number;
  total_users_with_badges: number;
  avg_score_per_badge: number;
  highest_scoring_badge: Badge;
  rarity_distribution: {
    [rarity: string]: number;
  };
}

/**
 * 算分算法参数
 */
export interface ScoreAlgorithmParams {
  base_score_weight: number;
  rarity_multiplier: number;
  time_decay_factor: number;
  user_activity_bonus: number;
  difficulty_adjustment: number;
}

/**
 * 批量导入徽章数据
 */
export interface BadgeBatchImportRequest {
  badges: BadgeScoreData[];
  overwrite_existing: boolean;
  validate_before_import: boolean;
}

/**
 * 徽章导入响应
 */
export interface BadgeBatchImportResponse {
  success: boolean;
  data?: {
    imported_count: number;
    updated_count: number;
    failed_count: number;
    failed_items: Array<{
      badge_id: number;
      error: string;
    }>;
  };
  error?: string;
}

/**
 * 安全响应包装器
 */
export interface BadgeSafeResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 