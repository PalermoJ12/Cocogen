<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_quotation_items', function (Blueprint $table) {
            $table->id();
            $table->integer('quotation_id');
            $table->integer('item_id');
            $table->integer('item_quantity');
            $table->integer('item_price');
            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotation_items_models');
    }
};
