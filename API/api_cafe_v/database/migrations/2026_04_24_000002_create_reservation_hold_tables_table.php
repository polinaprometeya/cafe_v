<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservation_hold_tables', function (Blueprint $table) {
            $table->id();

            $table->foreignId('hold_id')->constrained('reservation_holds')->cascadeOnDelete();
            $table->foreignId('table_id')->constrained('tables')->cascadeOnDelete();

            $table->timestamps();

            $table->unique(['hold_id', 'table_id']);
            $table->index(['table_id', 'hold_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservation_hold_tables');
    }
};

