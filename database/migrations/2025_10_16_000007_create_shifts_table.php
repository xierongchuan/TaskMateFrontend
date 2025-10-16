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
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('dealership_id')->constrained()->cascadeOnDelete();
            $table->timestamp('shift_start');
            $table->timestamp('shift_end')->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->integer('late_minutes')->default(0);
            $table->string('opening_photo_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
