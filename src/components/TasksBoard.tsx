
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const TasksBoard = () => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['featured-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('payout_points', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tasks</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete tasks and earn points to boost your MLM success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tasks</h2>
            <p className="text-gray-600">No tasks available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'social_media': return 'bg-blue-100 text-blue-800';
      case 'content_creation': return 'bg-purple-100 text-purple-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'webinar_attendance': return 'bg-orange-100 text-orange-800';
      case 'app_engagement': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'social_media': return <Users className="w-4 h-4" />;
      case 'content_creation': return <Trophy className="w-4 h-4" />;
      case 'training': return <Clock className="w-4 h-4" />;
      case 'webinar_attendance': return <Users className="w-4 h-4" />;
      case 'app_engagement': return <Trophy className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Tasks</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete tasks and earn points to boost your MLM success
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg ${getTaskTypeColor(task.type)}`}>
                    {getTaskTypeIcon(task.type)}
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {task.payout_points} pts
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {task.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {task.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs capitalize">
                    {task.type.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {task.proof_type.replace('_', ' ')}
                  </Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-between"
                  onClick={() => window.location.href = `/tasks/${task.id}`}
                >
                  Start Task
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => window.location.href = '/tasks'}>
            View All Tasks
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TasksBoard;
