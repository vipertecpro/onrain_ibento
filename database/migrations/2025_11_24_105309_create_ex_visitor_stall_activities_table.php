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
        Schema::create('ex_stall_visitor_stall_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exhibition_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ex_stall_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ex_visitor_id')->constrained()->cascadeOnDelete();
            $table->json('activity_info');
            $table->string('activity_description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ex_stall_visitor_stall_activities');
    }
};
