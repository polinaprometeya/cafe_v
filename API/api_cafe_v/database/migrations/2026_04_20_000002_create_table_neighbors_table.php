<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('table_neighbors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('table_id')->constrained('tables')->cascadeOnDelete(); //just FK
            $table->foreignId('neighbor_table_id')->constrained('tables')->cascadeOnDelete(); // Junction , notes nabour tables
            $table->timestamps();

            $table->unique(['table_id', 'neighbor_table_id']); //this makes sure you cannot double book
            $table->index(['neighbor_table_id', 'table_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('table_neighbors');
    }
};

