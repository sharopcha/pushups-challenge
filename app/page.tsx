import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Trophy, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Push-Up Challenge
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Track your progress, compete with friends, and achieve your fitness goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Join the Challenge?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to stay motivated and track your fitness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Activity className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Track Daily</CardTitle>
              <CardDescription>
                Log your push-ups multiple times throughout the day
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Monitor Progress</CardTitle>
              <CardDescription>
                View your daily and weekly totals with detailed history
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Weekly Leaderboard</CardTitle>
              <CardDescription>
                Compete with others and climb to the top
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Community</CardTitle>
              <CardDescription>
                See how others are progressing and stay motivated
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of users already crushing their fitness goals
          </p>
          <Link href="/auth">
            <Button size="lg">
              Join the Challenge
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
