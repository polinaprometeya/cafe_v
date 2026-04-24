<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservation_holds', function (Blueprint $table) {
            $table->id();

            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->unsignedInteger('guests_amount');
            $table->dateTime('expires_at')->index();

            $table->timestamps();

            $table->index(['start_time', 'end_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_holds');
    }
};

