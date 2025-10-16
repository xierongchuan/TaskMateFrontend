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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('comment')->nullable();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('dealership_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamp('appear_date')->nullable();
            $table->timestamp('deadline')->nullable();
            $table->enum('recurrence', ['daily', 'weekly', 'monthly'])->nullable();
            $table->enum('task_type', ['individual', 'group'])->default('group');
            $table->enum('response_type', ['acknowledge', 'complete'])->default('complete');
            $table->json('tags')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('postpone_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
