'use client';

import {useState, useEffect} from 'react';
import {motion} from 'motion/react';
import {useAuth} from '@/hooks/use-auth';
import {toast} from 'sonner';
import {Separator} from '@/components/ui/separator';
import {Skeleton} from '@/components/ui/skeleton';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Trophy, RefreshCw, Award, Star, Crown, Medal} from 'lucide-react';
import {CountingNumber} from '@/components/animate-ui/text/counting-number';
import services from '@/lib/services';
import {UserBadge} from '@/lib/services/badge/types';

/**
 * 徽章稀有度配置
 */
const RARITY_CONFIG = {
  common: {
    label: '普通',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: <Medal className="h-4 w-4" />,
  },
  rare: {
    label: '稀有',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Award className="h-4 w-4" />,
  },
  epic: {
    label: '史诗',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Star className="h-4 w-4" />,
  },
  legendary: {
    label: '传说',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Crown className="h-4 w-4" />,
  },
} as const;

/**
 * 徽章卡片组件
 */
interface BadgeCardProps {
  badge: UserBadge;
  index: number;
}

function BadgeCard({badge, index}: BadgeCardProps) {
  const rarity = RARITY_CONFIG[badge.rarity_level as keyof typeof RARITY_CONFIG] || RARITY_CONFIG.common;

  return (
    <motion.div
      initial={{opacity: 0, y: 20}}
      animate={{opacity: 1, y: 0}}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {rarity.icon}
              <Badge variant="secondary" className={rarity.color}>
                {rarity.label}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              ID: {badge.id}
            </div>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {badge.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed mb-3">
            {badge.description}
          </CardDescription>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>获得时间</span>
            <span>{new Date(badge.obtained_at || '').toLocaleDateString('zh-CN')}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * 骨架屏组件
 */
function BadgesSkeleton() {
  return (
    <div className="space-y-6">
      {/* 总分卡片骨架屏 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-16 w-24" />
          </div>
        </CardHeader>
      </Card>

      {/* 徽章网格骨架屏 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({length: 8}).map((_, i) => (
          <Card key={i} className="h-[200px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * 用户徽章主组件
 */
export function UserBadgesMain() {
  const {user} = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cooldown, setCooldown] = useState(0);

  /**
   * 获取用户徽章数据
   */
  const fetchUserBadges = async (showLoading = true) => {
    if (!user?.id) return;

    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const result = await services.badge.getUserBadgesSafe(user.id.toString());
      
      if (result.success && result.data) {
        setBadges(result.data);
        // 计算总分（这里假设后端会返回总分，或者前端计算）
        const total = result.data.reduce((sum, badge) => sum + (badge.score || 0), 0);
        setTotalScore(total);
      } else {
        toast.error(result.error || '获取徽章数据失败');
        setBadges([]);
        setTotalScore(0);
      }
    } catch (error) {
      toast.error('获取徽章数据失败');
      setBadges([]);
      setTotalScore(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 刷新数据
   */
  const handleRefresh = async () => {
    if (isLoading || cooldown > 0) return;

    setCooldown(3);
    try {
      await fetchUserBadges(false);
      toast.success('徽章数据已刷新');
    } finally {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    fetchUserBadges();
  }, [user?.id]);

  /**
   * 获取刷新按钮内容
   */
  const getRefreshContent = () => {
    if (isLoading) return '刷新中...';
    if (cooldown > 0) return `${cooldown}s`;
    return '刷新数据';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BadgesSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="space-y-8"
      >
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">我的徽章</h1>
            <p className="text-muted-foreground mt-2">
              查看您获得的所有徽章和总得分
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || cooldown > 0}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {getRefreshContent()}
          </Button>
        </div>

        <Separator />

        {/* 总分卡片 */}
        <motion.div
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.4, delay: 0.2}}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    徽章总得分
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    基于您获得的 {badges.length} 个徽章计算
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">
                    <CountingNumber number={totalScore} transition={{stiffness: 60, damping: 40}} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    总分
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* 徽章展示 */}
        {badges.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">徽章列表</h2>
              <Badge variant="secondary">
                共 {badges.length} 个徽章
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {badges.map((badge, index) => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5, delay: 0.3}}
          >
            <Card className="text-center py-12">
              <CardContent>
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-xl mb-2">暂无徽章</CardTitle>
                <CardDescription>
                  您还没有获得任何徽章，快去参与活动获得您的第一个徽章吧！
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 