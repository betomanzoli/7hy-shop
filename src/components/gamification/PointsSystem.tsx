
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Star, Trophy, Gift, Zap, Award, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface UserStats {
  points: number;
  level: number;
  badges: string[];
  totalSavings: number;
  productsViewed: number;
  dealsClaimed: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  requirement: number;
  current: number;
  completed: boolean;
}

export const PointsSystem = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 1250,
    level: 3,
    badges: ['first-purchase', 'deal-hunter', 'price-tracker'],
    totalSavings: 847.32,
    productsViewed: 156,
    dealsClaimed: 23
  });

  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      name: 'Primeiros Passos',
      description: 'Visualize 10 produtos',
      icon: <Zap className="w-5 h-5" />,
      points: 50,
      requirement: 10,
      current: userStats.productsViewed,
      completed: userStats.productsViewed >= 10
    },
    {
      id: 'deal-hunter',
      name: 'Caçador de Ofertas',
      description: 'Aproveite 20 ofertas',
      icon: <Trophy className="w-5 h-5" />,
      points: 200,
      requirement: 20,
      current: userStats.dealsClaimed,
      completed: userStats.dealsClaimed >= 20
    },
    {
      id: 'savings-master',
      name: 'Mestre da Economia',
      description: 'Economize R$ 1.000',
      icon: <Crown className="w-5 h-5" />,
      points: 500,
      requirement: 1000,
      current: userStats.totalSavings,
      completed: userStats.totalSavings >= 1000
    },
    {
      id: 'social-sharer',
      name: 'Compartilhador',
      description: 'Compartilhe 5 produtos',
      icon: <Star className="w-5 h-5" />,
      points: 100,
      requirement: 5,
      current: 2,
      completed: false
    }
  ];

  const getLevelInfo = (level: number) => {
    const levels = [
      { name: 'Iniciante', minPoints: 0, maxPoints: 500, color: 'bg-gray-500' },
      { name: 'Explorador', minPoints: 500, maxPoints: 1000, color: 'bg-green-500' },
      { name: 'Caçador', minPoints: 1000, maxPoints: 2000, color: 'bg-blue-500' },
      { name: 'Expert', minPoints: 2000, maxPoints: 5000, color: 'bg-purple-500' },
      { name: 'Mestre', minPoints: 5000, maxPoints: 10000, color: 'bg-yellow-500' },
    ];
    return levels[level - 1] || levels[levels.length - 1];
  };

  const currentLevel = getLevelInfo(userStats.level);
  const nextLevel = getLevelInfo(userStats.level + 1);
  const progressToNextLevel = nextLevel ? 
    ((userStats.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 : 100;

  const claimReward = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement?.completed) {
      setUserStats(prev => ({
        ...prev,
        points: prev.points + achievement.points
      }));
      toast.success(`Parabéns! Você ganhou ${achievement.points} pontos!`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full ${currentLevel.color} flex items-center justify-center`}>
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{userStats.points}</h3>
                <p className="text-sm text-gray-600">Pontos Totais</p>
                <Badge className={currentLevel.color}>
                  Nível {userStats.level} - {currentLevel.name}
                </Badge>
              </div>
            </div>
            {nextLevel && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Próximo nível</span>
                  <span>{Math.round(progressToNextLevel)}%</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {nextLevel.minPoints - userStats.points} pontos restantes
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">R$ {userStats.totalSavings.toFixed(2)}</h3>
                <p className="text-sm text-gray-600">Total Economizado</p>
                <Badge className="bg-green-500">
                  {userStats.dealsClaimed} ofertas aproveitadas
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{userStats.badges.length}</h3>
                <p className="text-sm text-gray-600">Conquistas</p>
                <Badge className="bg-blue-500">
                  {userStats.productsViewed} produtos visualizados
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Conquistas
          </CardTitle>
          <CardDescription>
            Complete missões e ganhe pontos para subir de nível
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`relative ${achievement.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${achievement.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso</span>
                            <span>{Math.min(achievement.current, achievement.requirement)}/{achievement.requirement}</span>
                          </div>
                          <Progress 
                            value={(achievement.current / achievement.requirement) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <Badge variant="outline">
                            +{achievement.points} pontos
                          </Badge>
                          {achievement.completed && (
                            <Button 
                              size="sm" 
                              onClick={() => claimReward(achievement.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Resgatar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards Store */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="w-5 h-5 mr-2" />
            Loja de Recompensas
          </CardTitle>
          <CardDescription>
            Troque seus pontos por benefícios exclusivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Cupom 5% OFF', points: 500, description: 'Desconto em qualquer compra', available: true },
              { name: 'Acesso Premium', points: 1000, description: 'Alertas prioritários por 1 mês', available: true },
              { name: 'Cupom 10% OFF', points: 1500, description: 'Desconto especial', available: false }
            ].map((reward, index) => (
              <Card key={index} className={reward.available ? 'border-blue-200' : 'opacity-50'}>
                <CardContent className="p-4 text-center">
                  <div className="mb-4">
                    <Gift className="w-8 h-8 mx-auto text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">{reward.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {reward.points} pontos
                    </Badge>
                    <Button 
                      size="sm" 
                      disabled={!reward.available || userStats.points < reward.points}
                      variant={reward.available && userStats.points >= reward.points ? "default" : "outline"}
                    >
                      {userStats.points >= reward.points ? 'Resgatar' : 'Pontos Insuf.'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
