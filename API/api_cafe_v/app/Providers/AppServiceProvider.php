<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        //throttle definition 
        //rate limiter is for protection against abuse
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        }); //max 60 request in 1 minute - rate limiter

        // RateLimiter::for('reviews', function (Request $request) {
        //     return Limit::perHour(3)->by(optional($request->user())->id ?: $request->ip());
        // });

        //due to policy this is technically redundant, it makes more sense to have authentication for not model specific actions here
        //Gate::authorize('update', function ($user, Event $event) { return $user->id === $event->user_id;});
        // Gate::define('update-event', function ($user, Event $event) {  return $user->id === $event->user_id;  });
        // Gate::define('delete-attendee', function ($user, Event $event, Attendee $attendee) { return $user->id === $event->user_id || $user->id === $attendee->user_id;});
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
