<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ex_stalls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exhibition_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ex_hall_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ex_stall_category_id')->constrained()->cascadeOnDelete();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->integer('booth_number')->default(0);
            $table->json('features');
            $table->enum('status',[
                'active',
                'inactive',
            ])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ex_stalls');
    }
};
