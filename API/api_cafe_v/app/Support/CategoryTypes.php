<?php

namespace App\Support;

final class CategoryTypes
{
    public const DRINK = 'Drink';

    public const FOOD = 'Food';

    public const STARTER = 'Starter';

    public const DESSERT = 'Dessert';

    /**
     * Single source of truth for category type ids and stored `categories.type` values.
     *
     * @return list<array{id: int, type: string}>
     */
    public static function definitions(): array
    {
        return [
            ['id' => 1, 'type' => self::DRINK],
            ['id' => 2, 'type' => self::FOOD],
            ['id' => 3, 'type' => self::STARTER],
            ['id' => 4, 'type' => self::DESSERT],
        ];
    }

    /**
     * Values persisted in `categories.type` (unique string column).
     *
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::definitions(), 'type');
    }
}
