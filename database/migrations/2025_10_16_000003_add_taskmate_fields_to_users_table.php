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
        Schema::table('users', function (Blueprint $table) {
            $table->string('login')->unique()->nullable()->after('id');
            $table->string('full_name')->nullable()->after('login');
            $table->bigInteger('telegram_id')->unique()->nullable()->after('full_name');
            $table->string('phone', 50)->nullable()->after('telegram_id');
            $table->enum('role', ['employee', 'manager', 'observer', 'owner'])->default('employee')->after('phone');
            $table->foreignId('company_id')->nullable()->constrained()->cascadeOnDelete()->after('role');
            $table->foreignId('dealership_id')->nullable()->constrained()->cascadeOnDelete()->after('company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropForeign(['dealership_id']);
            $table->dropColumn([
                'login',
                'full_name',
                'telegram_id',
                'phone',
                'role',
                'company_id',
                'dealership_id',
            ]);
        });
    }
};
