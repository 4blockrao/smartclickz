
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Star, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const TopNetworkersCarousel = () => {
  const { data: networkers, isLoading } = useQuery({
    queryKey: ['top-networkers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('points', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    if (networkers) {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(networkers.length / 3));
    }
  };

  const prevSlide = () => {
    if (networkers) {
      setCurrentIndex((prev) => prev === 0 ? Math.ceil(networkers.length / 3) - 1 : prev - 1);
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Networkers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our highest performing network marketers who are leading by example
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
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

  if (!networkers || networkers.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Networkers</h2>
            <p className="text-gray-600">No networkers found at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  const visibleNetworkers = networkers.slice(currentIndex * 3, (currentIndex * 3) + 3);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Top Networkers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our highest performing network marketers who are leading by example
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleNetworkers.map((networker, index) => (
              <Card key={networker.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <img
                      src={networker.profile_image_url || `https://images.unsplash.com/photo-150${7 + index}003211169-0a1dd7228f2d?w=150`}
                      alt={networker.display_name}
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {networker.display_name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {networker.bio || 'Professional network marketer'}
                  </p>
                  
                  <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{networker.points}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">{networker.team_size}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {networker.specialization || 'Network Marketing'}
                    </Badge>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = `/profiles/${networker.id}`}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {networkers.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => window.location.href = '/profiles'}>
            View All Profiles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopNetworkersCarousel;
